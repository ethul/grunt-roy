module.exports = function(grunt){
  'use strict';

  grunt.initConfig({
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: [
        'grunt.js',
        'tasks/**/*.js',
        'test/**/*.js'
      ]
    },
    jshint: {
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
  grunt.registerTask('default', 'lint test');
};
