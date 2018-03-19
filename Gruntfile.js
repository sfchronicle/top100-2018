/*jshint node:true*/

// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

var path = require("path");
var fs = require("fs");
var url = require("url");

module.exports = function (grunt) {

  
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-open");
  grunt.loadNpmTasks("grunt-run");
  grunt.loadTasks("./tasks");

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      options: {
        spawn: false,
        livereload: true
      },
      js: {
        files: ['static/scripts/**/*.js'],
        tasks: ['jshint', 'build']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      less: {
        files: ['static/styles/*.less'],
        tasks: ['less', 'build']
      },
      reload: {
        files: ['templates/**/*.html','static/images/**/*'],
        tasks: ['less', 'build']
      }
    },

    connect: {
      dev: {
        options: {
          hostname: "0.0.0.0",
          livereload: true,
          base: "./build",
          //middleware to protect against case-insensitive file systems
          middleware: function(connect, options, ware) {
            var base = options.base.pop();
            ware.unshift(function(req, response, next) {
              var href = url.parse(req.url).pathname;
              var location = path.join(base, href);
              var filename = path.basename(href);
              if (!filename) return next();
              var dir = path.dirname(location);
              fs.readdir(dir, function(err, list) {
                if (!err && list.indexOf(filename) == -1) {
                  response.statusCode = 404;
                  response.end("<pre>            404 Not Found\n-this space intentionally left blank-</pre>");
                } else {
                  next();
                }
              })
            });
            return ware;
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'static/scripts/**/*.js'
      ]
    },

    open: {
      dev: {
        path: 'http://127.0.0.1:5000'
      },
      prod: {
        path: 'http://projects.sfchronicle.com/2017/<%= grunt.data.json.project.production_path %>'
      }
    },

    // Run build.py file to serve static files 
    run: {
      options: {
        stdout: true,
        stderr: true,
      },
      staging: {
        exec: 'python build.py staging'
      },
      production: {
        exec: 'python build.py production'
      },
      dev: {
        exec: 'python build.py dev'
      }
    },

    // Converts .html files to .php
    copy: {
      production: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: ['**/*.html'],
          dest: 'build/',
          rename: function (dest, src) {
            return dest + src.replace('.html','.php');
          }
        }]
      }
    },

    // Deletes .html files from build folder
    clean: ['build/**/*.html']

  });


  grunt.registerTask('default', [
    'less',
    'build',
    'connect:dev',
    'watch'
  ]);

  // Build static files; defaults to dev. Command = 'grunt build:production'
  grunt.registerTask('build', function(target) {
    if (target) {
      grunt.task.run (['run:' + target, 'php']);
    } else {
      grunt.task.run(['run:dev']);
    }
  });

  // converts all .html files into .php files
  grunt.registerTask('php', function(target) {
    grunt.task.run (['copy', 'clean']);
  });



};