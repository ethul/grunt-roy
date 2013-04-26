module.exports = function(grunt){
  'use strict';

  grunt.registerMultiTask('roy', 'compiles roy files', function(){
    var files = this.files
      , options = this.data.options || {}
    ;
    return files.reduce(function(a, file){
      return a && file.src.reduce(function(b, src){
        var os = grunt.util._.clone(options);
        return b && compile(src, file.dest, os);
      }, true);
    }, true);
  });

  function compile(srcpath, dest, options) {
    var roy = require('roy')
      , path = require('path')
      , destpath = resolveDest(srcpath, dest)
      , res = (function(){
          try {
            var out = writeSourceMap(srcpath, destpath, options, function(a){
                  return roy.compile(grunt.file.read(srcpath), {}, {}, {
                    filename: path.basename(srcpath),
                    sourceMap: a,
                    strict: options.strict,
                    nodejs: options.nodejs
                  }).output;
                })
              , _ = grunt.file.write(destpath, out)
            ;
            return true;
          }
          catch(e) {
            grunt.log.error('Compilation of ' + srcpath + ' has failed');
            grunt.log.error(e);
            return false;
          }
        }())
    ;
    return res;
  }

  function resolveDest(srcpath, dest) {
    var path = require('path')
      , srcdirs = path.dirname(srcpath).split(path.sep).slice(1)
      , srcdir = path.join.apply(path, srcdirs)
      , destfile = path.basename(srcpath, '.roy') + '.js'
    ;
    return path.join(dest, srcdir, destfile);
  }

  // The sources in the source map file are not specified as absolute
  // urls, which means that they will be resolved relative to the
  // location of the source map file.
  //
  // Also, we specify a relative path for the source mapping url, which
  // causes the script source of the JS to be used as the source origin.
  // Also, this url must adhere to RFC3986.
  function writeSourceMap(srcpath, destpath, options, f) {
    var path = require('path')
      , SourceMapGenerator = require('source-map').SourceMapGenerator
      , sourceMap = new SourceMapGenerator({file: path.basename(destpath)})
      , sourceMapDest = destpath + '.map'
      , sourceMappingUrl = encodeURIComponent(path.basename(sourceMapDest))
      , res = f(sourceMap) + (options.sourceMap ?
          '//@ sourceMappingURL=' + sourceMappingUrl + '\n' : ''
        )
      , _ = (function(){
          if (options.sourceMap) {
            grunt.file.write(sourceMapDest, sourceMap.toString());
            grunt.file.copy(srcpath, path.join.apply(path, [
              path.dirname(destpath),
              path.basename(srcpath)
            ]));
          }
        }())
    ;
    return res;
  }

  return {
    compile: compile
  };
};
