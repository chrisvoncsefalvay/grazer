'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(function(contrib) {
    grunt.log.ok([contrib + " is loaded"]);
    grunt.loadNpmTasks(contrib);
  });

  var config = {
    dist: 'lib',
    src: 'src',
    distTest: 'specs/dist',
    srcTest: 'specs/src'
  };

  // Project configuration.
  grunt.initConfig({
    config: config,
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '<%= config.dist %>/*',
              '<%= config.distTest %>/*',
              '!<%= config.dist %>/.git*'
            ]
          }
        ]
      },
    },
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.src %>',
          src: '{,*/}*.coffee',
          dest: '<%= config.dist %>',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: '<%= config.srcTest %>',
          src: '{,*/}*.spec.coffee',
          dest: '<%= config.distTest %>',
          ext: '.spec.js'
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      dist: {
        files: '<%= config.src %>/*',
        tasks: ['coffee:dist']
      },
      test: {
        files: '<%= config.srcTest %>/*',
        tasks: ['coffee:test']
      }
    },
    simplemocha: {
      options: {
        globals: [
        'sinon',
        'chai',
        'should',
        'expect',
        'assert',
        'AssertionError',
        ],
        timeout: 3000,
        ignoreLeaks: false,
        // grep: '*.spec',
        ui: 'bdd',
        reporter: 'spec'
      },
      backend: {
        src: [
          // add chai and sinon globally
          'test/support/globals.js',

          // tests
          'test/dist/**/*.spec.js',
        ],
      },
    },
  });

  grunt.registerTask('coverageBackend', 'Test backend files as well as code coverage.', function () {
    var done = this.async();

    var path = './test/support/runner.js';

    var options = {
      cmd: 'istanbul',
      grunt: false,
      args: [
        'cover',
        '--default-excludes',
        '-x', 'app/**',
        '--report', 'lcov',
        '--dir', './coverage/backend',
        path
      ],
      opts: {
        // preserve colors for stdout in terminal
        stdio: 'inherit',
      },
    };

    function doneFunction(error, result) {
      if (result && result.stderr) {
        process.stderr.write(result.stderr);
      }

      if (result && result.stdout) {
        grunt.log.writeln(result.stdout);
      }

      // abort tasks in queue if there's an error
      done(error);
    }

    grunt.util.spawn(options, doneFunction);
  });


  // Default task.
  grunt.registerTask('default', ['coffee', 'jshint']);

  grunt.registerTask('test', [
    'clean',
    'coffee',
  ]);

  grunt.registerTask('coverage', [
    'clean',
    'coffee',
    'coverageBackend'
  ]);
};
