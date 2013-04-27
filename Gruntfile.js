module.exports = function(grunt){
  'use strict';

  grunt.initConfig({
    nodeunit: {
      tests: ['test/**/*.js']
    },
    jshint: {
      files: [
        'grunt.js',
        'tasks/**/*.js',
        'test/**/*.js'
      ],
      options: {
        bitwise: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        plusplus: true,
        quotmark: true,
        regexp: true,
        undef: true,
        trailing: true,
        laxcomma: true,
        node: true
      }
    }
  });
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.registerTask('default', ['jshint', 'nodeunit']);
};
