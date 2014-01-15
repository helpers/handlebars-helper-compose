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

  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    book: grunt.file.readYAML('test/fixtures/data/book.yml'),
    blog: grunt.file.readYAML('test/fixtures/data/blog.yml'),
    config: grunt.file.readYAML('_config.yml'),

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
        config: '<%= config %>',
        data: ['<%= config.data %>'],
        helpers: ['./index.js'],
        partials: ['<%= config.includes %>'],
        layoutdir: '<%= config.layouts %>',
        layoutext: '<%= config.layoutext %>',
        layout: '<%= config.layout %>'
      },

      // No options defined
      templates: {
        options: {
          flatten: false,
          compose: {
            process: true
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/dynamic', src: ['**/*.hbs'], dest: '<%= config.actual %>/dynamic/', ext: '.html'}
        ]
      },

      context: {
        options: {
          compose: {
            cwd: '<%= config.book %>',
            sep: '<!-- chapter -->',
            origin: true
          }
        },
        src: ['<%= config.pages %>/context-*.hbs'],
        dest: '<%= config.actual %>/context/',
      },

      book: {
        options: {
          compose: {
            cwd: '<%= config.book %>',
            sep: '<!-- chapter -->'
          }
        },
        src: ['<%= config.pages %>/{book,toc}.hbs'],
        dest: '<%= config.actual %>/book/',
      },

      // No options defined
      bogus_options: {
        options: {
          compose: {
            foo: 'bar'
          }
        },
        src: ['<%= config.pages %>/full_path.hbs'],
        dest: '<%= config.actual %>/bogus_options/',
      },


      // No options defined
      no_opts_defined: {
        options: {
          compose: {}
        },
        src: ['<%= config.pages %>/full_path.hbs'],
        dest: '<%= config.actual %>/no_opts_defined/',
      },

      // Should use cwd defined in task options (Gruntfile)
      opts_cwd: {
        options: {
          compose: {
            cwd: '<%= config.posts %>',
            sep: '<!-- article -->'
          }
        },
        src: ['<%= config.pages %>/opts_cwd.hbs'],
        dest: '<%= config.actual %>/opts_cwd/',
      },

      // Should use cwd from options hash
      opts_hash_cwd: {
        options: {
          compose: {process: true}
        },
        src: ['<%= config.posts %>/opts_hash_cwd.hbs'],
        dest: '<%= config.actual %>/opts_hash_cwd/'
      },

      // Should use a custom separator between sections
      custom_separator_opts: {
        options: {
          compose: {
            cwd: '<%= config.posts %>',
            sep: '<!-- CUSTOM SEPARATOR -->'
          }
        },
        src: ['<%= config.pages %>/custom_sep_opts.hbs'],
        dest: '<%= config.actual %>/custom_separator_opts/',
      },

      // Should use a custom separator between sections
      custom_separator_hash: {
        options: {
          compose: {
            cwd: '<%= config.posts %>'
          }
        },
        src: ['<%= config.pages %>/custom_sep_hash.hbs'],
        dest: '<%= config.actual %>/custom_separator_hash/',
      },

      // Basic compare function
      compare_fn_index: {
        src: ['<%= config.pages %>/toc-sorting.hbs'],
        dest: '<%= config.actual %>/compare_fn_index/',
        options: {
          compose: {
            cwd: '<%= config.book %>',
            sep: '<!-- chapter -->',
            compare: function(a, b) {
              return a.data.index >= b.data.index ? 1 : -1;
            }
          }
        }
      },

      // Basic compare function
      compare_fn_custom_prop: {
        src: ['<%= config.pages %>/toc-sorting.hbs'],
        dest: '<%= config.actual %>/compare_fn_custom_prop/',
        options: {
          compose: {
            cwd: '<%= config.book %>',
            sep: '<!-- chapter -->',
            compare: function(a, b) {
              return a.data.custom >= b.data.custom ? 1 : -1;
            }
          }
        }
      },

      // Alternative compare function
      compare_fn_chapter: {
        src: ['<%= config.pages %>/toc-sorting.hbs'],
        dest: '<%= config.actual %>/compare_fn_chapter/',
        options: {
          compose: {
            cwd: '<%= config.book %>',
            sep: '<!-- chapter -->',
            compare: function(a, b) {
              a = a.data.chapter;
              b = b.data.chapter;
              if(a === b) {
                return 0;
              } else if (a > b) {
                return 1;
              } else {
                return -1;
              }
            },
            debug: 'tmp/obj.json'
          }
        }
      }
    },

    // Before generating any new files,
    // remove files from previous build.
    clean: {
      example: ['<%= config.actual %>/**']
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
