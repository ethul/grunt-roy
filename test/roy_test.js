'use strict';

var path = require('path')
  , sinon = require('sinon')
  , roy = require('../tasks/roy')
  , f = function(){}
  , grunt = {
      file: {write: f, read: f, copy: f},
      log: {error: f},
      registerMultiTask: f
    }
;

exports.roy = {
  setUp: function(done){
    var that = this;
    this.write = sinon.spy(grunt.file, 'write');
    this.copy = sinon.spy(grunt.file, 'copy');
    this.read = sinon.stub(grunt.file, 'read', function(a){
      return that.fs[a];
    });
    this.compile = function(out, src, dest, opts){
      return roy(grunt).compile(src, out, opts);
    };
    done();
  },
  tearDown: function(done){
    this.write.restore();
    this.copy.restore();
    this.read.restore();
    done();
  },
  '#compile - file in top dir': function(test){
    var that = this
      , outdir = 'b'
      , srcroy = 'a/a.roy'
      , destjs = outdir + '/a.js'
      , _ = (function(){
          that.fs = {};
          that.fs[srcroy] = 'let a = "hello"';
          that.fs[destjs] = '(function () {\n    var a = \'hello\';\n}());';
        }())
      , res = this.compile(outdir, srcroy, destjs, {})
    ;
    test.ok(res);
    test.equal(this.write.getCall(0).args[0], destjs);
    test.equal(this.write.getCall(0).args[1], this.fs[destjs]);
    test.done();
  },
  '#compile - file in sub dir': function(test){
    var that = this
      , outdir = 'b'
      , srcroy = 'a/b/c/a.roy'
      , destjs = outdir + '/b/c/a.js'
      , _ = (function(){
          that.fs = {};
          that.fs[srcroy] = 'let a = "hello"';
          that.fs[destjs] = '(function () {\n    var a = \'hello\';\n}());';
        }())
      , res = this.compile(outdir, srcroy, destjs, {})
    ;
    test.ok(res);
    test.equal(this.write.getCall(0).args[0], destjs);
    test.equal(this.write.getCall(0).args[1], this.fs[destjs]);
    test.done();
  },
  '#compile - source maps enabled': function(test){
    var that = this
      , outdir = 'b'
      , srcroy = 'a/a.roy'
      , destroy = outdir + '/a.roy'
      , destjs = outdir + '/a.js'
      , destmap = destjs + '.map'
      , _ = (function(){
          that.fs = {};
          that.fs[srcroy] = 'let a = "hello"\nlet b = "world"\nlet c = "test"';
          that.fs[destjs] =
            '(function () {\n' +
            '    var a = \'hello\';\n' +
            '    var b = \'world\';\n' +
            '    var c = \'test\';\n}());//@ sourceMappingURL=a.js.map\n';
          that.fs[destmap] = '{"version":3,"file":"a.js","sources":[],"names":[],"mappings":""}';
        }())
      , res = this.compile(outdir, srcroy, destjs, {
          sourceMap: true
        })
    ;
    test.ok(res);
    test.equal(this.write.getCall(0).args[0], destmap);
    test.equal(this.write.getCall(0).args[1], this.fs[destmap]);
    test.equal(this.write.getCall(1).args[0], destjs);
    test.equal(this.write.getCall(1).args[1], this.fs[destjs]);
    test.equal(this.copy.getCall(0).args[0], srcroy);
    test.equal(this.copy.getCall(0).args[1], destroy);
    test.done();
  },
  '#compile - strict enabled': function(test){
    var that = this
      , outdir = 'b'
      , srcroy = 'a/a.roy'
      , destjs = outdir + '/a.js'
      , _ = (function(){
          that.fs = {};
          that.fs[srcroy] = 'let a = "hello"';
          that.fs[destjs] =
            '\'use strict\';\n' +
            '(function () {\n' +
            '    var a = \'hello\';\n' +
            '}());';
        }())
      , res = this.compile(outdir, srcroy, destjs, {
          strict: true
        })
    ;
    test.ok(res);
    test.equal(this.write.getCall(0).args[0], destjs);
    test.equal(this.write.getCall(0).args[1], this.fs[destjs]);
    test.done();
  },
  '#compile - nodejs enabled': function(test){
    var that = this
      , outdir = 'b'
      , srcroy = 'a/a.roy'
      , destjs = outdir + '/a.js'
      , _ = (function(){
          that.fs = {};
          that.fs[srcroy] = 'let a = "hello"';
          that.fs[destjs] = 'var a = \'hello\';';
        }())
      , res = this.compile(outdir, srcroy, destjs, {
          nodejs: true
        })
    ;
    test.ok(res);
    test.equal(this.write.getCall(0).args[0], destjs);
    test.equal(this.write.getCall(0).args[1], this.fs[destjs]);
    test.done();
  }
};
