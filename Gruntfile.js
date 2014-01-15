/**
 * Handlebars Helper: {{compose}}
 * https://github.com/helpers/handlebars-helper-compose
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * https://github.com/jonschlinkert
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    book: grunt.file.readYAML('test/fixtures/data/book.yml'),
    blog: grunt.file.readYAML('test/fixtures/data/blog.yml'),
    site: grunt.file.readYAML('_config.yml'),

    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', 'index.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    assemble: {
      options: {
        flatten: true,
        site: '<%= site %>',
        data: ['<%= site.data %>'],
        helpers: ['./index.js'],
        partials: ['<%= site.includes %>'],
        layoutdir: '<%= site.layouts %>',
        layoutext: '<%= site.layoutext %>',
        layout: '<%= site.layout %>',
      },

      // Should use cwd defined in task options (Gruntfile)
      book: {
        options: {
          compose: {
            cwd: '<%= site.book %>',
            sep: '<!-- post -->'
          }
        },
        src: ['<%= site.pages %>/{book,toc}.hbs'],
        dest: '<%= site.actual %>/book/',
      },

      // No options defined
      bogus_options: {
        options: {
          compose: {
            foo: 'bar'
          }
        },
        src: ['<%= site.pages %>/full_path.hbs'],
        dest: '<%= site.actual %>/bogus_options/',
      },

      // No options defined
      no_opts_defined: {
        options: {
          compose: {}
        },
        src: ['<%= site.pages %>/full_path.hbs'],
        dest: '<%= site.actual %>/no_opts_defined/',
      },

      // Should use cwd defined in task options (Gruntfile)
      opts_cwd: {
        options: {
          compose: {
            cwd: '<%= site.posts %>',
            sep: '<!-- article -->'
          }
        },
        src: ['<%= site.pages %>/opts_cwd.hbs'],
        dest: '<%= site.actual %>/opts_cwd/',
      },

      // Should use cwd from options hash. Not sure why
      // someone would use this...
      opts_hash_cwd: {
        src: ['<%= site.posts %>/opts_hash_cwd.hbs'],
        dest: '<%= site.actual %>/opts_hash_cwd/'
      },

      // Should use a custom separator between sections
      custom_separator_opts: {
        options: {
          compose: {
            cwd: '<%= site.posts %>',
            sep: '<!-- CUSTOM SEPARATOR -->'
          }
        },
        src: ['<%= site.pages %>/custom_sep_opts.hbs'],
        dest: '<%= site.actual %>/custom_separator_opts/',
      },

      // Should use a custom separator between sections
      custom_separator_hash: {
        options: {
          compose: {
            cwd: '<%= site.posts %>'
          }
        },
        src: ['<%= site.pages %>/custom_sep_hash.hbs'],
        dest: '<%= site.actual %>/custom_separator_hash/',
      },

      // // Basic compare function
      // compare_function_one: {
      //   src: ['<%= site.fixtures %>/book/toc.hbs'],
      //   dest: '<%= site.actual %>/compare_function_one/',
      //   options: {
      //     compose: {
      //       cwd: '<%= site.fixtures %>/compose',
      //       sep: '<!-- post -->',
      //       compare: function(a, b) {
      //         return a.index >= b.index ? 1 : -1;
      //       }
      //     }
      //   }
      // },

      // // Alternative compare function
      // compare_function_two: {
      //   src: ['<%= site.fixtures %>/book/toc.hbs'],
      //   dest: '<%= site.actual %>/compare_function_two/',
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
      example: ['<%= site.actual %>/**']
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-sync-pkg');
  grunt.loadNpmTasks('assemble');

  // Default to tasks to run with the "grunt" command.
  grunt.registerTask('default', ['clean', 'jshint', 'assemble', 'sync']);
};
