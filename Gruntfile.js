/*
 * {{compose}}
 * https://github.com/assemble/compose
 *
 * Copyright (c) 2013 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    book: grunt.file.readYAML('test/fixtures/data/book.yml'),
    blog: grunt.file.readYAML('test/fixtures/data/blog.yml'),

    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', 'index.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Test config
    test: {
      fixtures: 'test/fixtures',
      data: 'test/fixtures/data',
      includes: 'test/fixtures/includes',
      layouts: 'test/fixtures/layouts',
      pages: 'test/fixtures/pages',
      actual: 'test/actual'
    },

    assemble: {
      options: {
        flatten: true,
        data: ['<%= book %>/data/book.yml'],
        layout: '<%= test.layouts %>/default.hbs',
        helpers: ['./index.js', 'helper-prettify'] // this helper
      },

      // No options defined
      no_opts_defined: {
        options: {
          compose: {}
        },
        src: ['<%= test.pages %>/full_path.hbs'],
        dest: '<%= test.actual %>/no_opts_defined/'
      },

      // Should use cwd defined in task options
      opts_cwd: {
        options: {
          compose: {
            cwd: '<%= test.includes %>'
          }
        },
        src: ['<%= test.pages %>/opts_cwd.hbs'],
        dest: '<%= test.actual %>/cwd/'
      },

      // Should use cwd from options hash. Not sure why
      // someone would use this...
      opts_hash_cwd: {
        src: ['<%= test.includes %>/opts_hash_cwd.hbs'],
        dest: '<%= test.actual %>/opts_hash_cwd/'
      },

      // Should use a custom separator between sections
      custom_separator_opts: {
        options: {
          compose: {
            cwd: '<%= test.includes %>',
            sep: '<!-- CUSTOM SEPARATOR -->'
          }
        },
        src: ['<%= test.pages %>/custom_sep_opts.hbs'],
        dest: '<%= test.actual %>/custom_separator_opts/'
      },

      // Should use a custom separator between sections
      custom_separator_hash: {
        options: {
          compose: {
            cwd: '<%= test.includes %>'
          }
        },
        src: ['<%= test.pages %>/custom_sep_hash.hbs'],
        dest: '<%= test.actual %>/custom_separator_hash/'
      },

      // // Basic compare function
      // compare_function_one: {
      //   src: ['<%= test.fixtures %>/book/toc.hbs'],
      //   dest: '<%= test.actual %>/compare_function_one/',
      //   options: {
      //     compose: {
      //       cwd: '<%= test.fixtures %>/compose',
      //       sep: '<!-- post -->',
      //       compare: function(a, b) {
      //         return a.index >= b.index ? 1 : -1;
      //       }
      //     }
      //   }
      // },

      // // Alternative compare function
      // compare_function_two: {
      //   src: ['<%= test.fixtures %>/book/toc.hbs'],
      //   dest: '<%= test.actual %>/compare_function_two/',
      //   options: {
      //     compose: {
      //       compare: function(a, b) {
      //         a = a.context.chapter;
      //         b = b.context.chapter;
      //         if(a === b) {
      //           return 0;
      //         } else if (a > b) {
      //           return 1;
      //         } else {
      //           return -1;
      //         }
      //       }
      //     }
      //   }
      // }
    },

    // Before generating any new files,
    // remove files from previous build.
    clean: {
      example: ['<%= test.actual %>/**']
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('assemble');

  // Default to tasks to run with the "grunt" command.
  grunt.registerTask('default', ['clean', 'jshint', 'assemble']);
};
