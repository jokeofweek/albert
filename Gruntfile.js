module.exports = function(grunt) {
 // Project configuration.
  grunt.initConfig({
    run: {
      'options': {},
      'albert': {
        'cmd': 'node-webkit/nw.exe',
        'args': ['src/']
      }
    }
  });

  // Load required modules
  grunt.loadNpmTasks('grunt-run');

  // Task definitions
  grunt.registerTask('default', ['run']);
};