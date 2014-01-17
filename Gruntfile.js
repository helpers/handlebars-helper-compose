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
      dynamic: {
        options: {
          flatten: false,
          compose: {
            sortBy: 'title',
            sortOrder: 'desc',
            process: true
          }
        },
        files: [{
          expand: true,
          cwd: '<%= config.templates %>/dynamic',
          src: ['**/*.{hbs,md}'],
          dest: '<%= config.dest %>/dynamic/',
          ext: '.html'
        }]
      },

      // No options defined
      dynamic_src_dest_pairings: {
        options: {
          flatten: false,
          compose: {
            sortBy: 'title',
            sortOrder: 'desc',
            process: true
          }
        },
        expand: true,
        cwd: '<%= config.templates %>/dynamic',
        src: ['**/*.{hbs,md}'],
        dest: '<%= config.dest %>/dynamic_src_dest/',
        ext: '.html'
      },

      context: {
        options: {
          compose: {
            sortBy: 'title',
            sortOrder: 'desc',
            cwd: '<%= config.book %>',
            sep: '<!-- chapter -->',
            origin: true
          }
        },
        src: ['<%= config.pages %>/context-*.hbs'],
        dest: '<%= config.dest %>/context/',
      },

      book: {
        options: {
          compose: {
            sortBy: 'number',
            sortOrder: 'desc',
            cwd: '<%= config.book %>',
            sep: '<!-- chapter -->'
          }
        },
        src: ['<%= config.pages %>/{book,toc}.hbs'],
        dest: '<%= config.dest %>/book/',
      },

      // No options defined
      bogus_options: {
        options: {
          compose: {
            foo: 'bar'
          }
        },
        src: ['<%= config.pages %>/full_path.hbs'],
        dest: '<%= config.dest %>/bogus_options/',
      },


      // No options defined
      no_opts_defined: {
        options: {
          compose: {}
        },
        src: ['<%= config.pages %>/full_path.hbs'],
        dest: '<%= config.dest %>/no_opts_defined/',
      },

      // Should use cwd defined in task options (Gruntfile)
      opts_cwd: {
        options: {
          compose: {
            sortBy: 'basename',
            cwd: '<%= config.posts %>',
            sep: '<!-- article -->'
          }
        },
        src: ['<%= config.pages %>/opts_cwd.hbs'],
        dest: '<%= config.dest %>/opts_cwd/',
      },

      // Should use cwd from options hash
      opts_hash_cwd: {
        options: {
          compose: {process: true}
        },
        src: ['<%= config.posts %>/opts_hash_cwd.hbs'],
        dest: '<%= config.dest %>/opts_hash_cwd/'
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
        dest: '<%= config.dest %>/custom_separator_opts/',
      },

      // Should use a custom separator between sections
      custom_separator_hash: {
        options: {
          compose: {
            cwd: '<%= config.posts %>'
          }
        },
        src: ['<%= config.pages %>/custom_sep_hash.hbs'],
        dest: '<%= config.dest %>/custom_separator_hash/',
      },

      // Basic compare function
      compare_fn_index: {
        src: ['<%= config.pages %>/toc-sorting.hbs'],
        dest: '<%= config.dest %>/compare_fn_index/',
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
        dest: '<%= config.dest %>/compare_fn_custom_prop/',
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
        dest: '<%= config.dest %>/compare_fn_chapter/',
        options: {
          compose: {
            cwd: '<%= config.book %>',
            sep: '<!-- chapter -->',
            compare: function(a, b) {
              return a.data.chapter >= b.data.chapter ? 1 : -1;
            },
            debug: 'tmp/obj.json'
          }
        }
      }
    },

    // Before generating any new files,
    // remove files from previous build.
    clean: {
      example: ['<%= config.dest %>/**']
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
