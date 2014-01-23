/**
 * Handlebars Helper: {{compose}}
 * https://github.com/helpers/handlebars-helper-compose
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * https://github.com/jonschlinkert
 * Licensed under the MIT license.
 */

'use strict';

// Node.js modules
var path   = require('path');

// node_modules
var file   = require('fs-utils');
var glob   = require('globule');
var marked = require('marked');
var extras = require('marked-extras');
var yfm    = require('yfm');
var _str   = require('underscore.string');
var _      = require('lodash');

module.exports.register = function (Handlebars, options, params) {

  var grunt = params.grunt;
  var opts = options || {};

  opts.compose = opts.compose || {};
  var customMarkedOpts = _.extend(options.marked || {});

  extras.init(customMarkedOpts);
  var markedOpts = _.defaults(customMarkedOpts, extras.markedDefaults);


  // The {{compose}} helper
  Handlebars.registerHelper('compose', function(context, options) {
    options = _.extend(context, options);
    var hash = options.hash || {};

    // Default options
    options = _.extend({glob: {}, sep: '\n'}, options, opts.compose, hash);
    var i = 0;
    var result = '';
    var data;
    var ctx = _.extend(grunt.config.data, opts, this);

    // Define marked.js options
    marked.setOptions(markedOpts);

    // Add some src variables to the context
    ctx.dir = path.dirname(ctx.page.src || '');
    ctx.base = file.basename(ctx.page.src);

    var patterns = grunt.config.process(options.src);
    if(!Array.isArray(patterns)) {
       patterns = [patterns];
    }

    options.cwd = grunt.task.current.files[0].orig.cwd || options.cwd;
    var cwd = path.join.bind(null, options.cwd || '');
    // Recalculate cwd after ctx.dir has been added to context
    if(options.hash.cwd) {
      cwd = path.join.bind(null, grunt.config.process(options.hash.cwd));
    }

    /**
     * Accepts two objects (a, b),
     * @param  {Object} a
     * @param  {Object} b
     * @return {Number} returns 1 if (a >= b), otherwise -1
     */
    var compareFn = function (a, b) {
      var opts = _.extend({sortOrder: 'asc', sortBy: 'index'}, options);

      a = a.data[opts.sortBy];
      b = b.data[opts.sortBy];

      var result = 0;
      result = a > b ? 1 : a < b ? -1 : 0;
      if(opts.sortOrder.toLowerCase() === 'desc') {
        return result * -1;
      }
      return result;
    };

    patterns.forEach(function (pattern) {
      var files = glob.find(cwd(pattern), options.glob);

      if(options.filter) {
        files = options.filter(files);
      }

      var src = files.map(function (filepath) {

        i += 1;

        var content = yfm(filepath).content || '';
        var metadata = yfm(filepath).context || {};

        /**
         * Process context from last to first, with #1 winning over other contexts.
         * 1. `context`          : The given context (second parameter)
         * 2. `metadata`         : YAML front matter of the partial
         * 3. `opts.data[name]`  : JSON/YAML data file defined in Assemble options.data
         *                         with a basename matching the name of the partial, e.g
         *                         {{include 'foo'}} => foo.json
         * 4. `this`             : Typically either YAML front matter of the "inheriting" page,
         *                         layout, block expression, or "parent" helper wrapping this helper
         * 5. `opts`             : Custom properties defined in Assemble options
         * 6. `grunt.config.data`: Data from grunt.config.data
         *                         (e.g. pkg: grunt.file.readJSON('package.json'))
         */
        var basename = file.basename(filepath);
        ctx = _.extend(ctx, opts.data[ctx.base], opts.data[basename], metadata, context);

        // Process config (Lo-Dash) templates
        ctx = processContext(grunt, ctx);
        // Also process metadata separately so we can use it to extend the `data` object
        metadata = processContext(grunt, metadata);

        // Inject private variables into block, so that variables on `data`
        // are only available in the block helper's child template and
        // not in the original context
        data = Handlebars.createFrame(ctx.data);
        data = _.extend(data, opts.compose, _.omit(metadata, ['assemble', 'pages', 'plugins', '_plugins']));

        // Best guess at some useful properties to add to the data context
        data.filepath  = filepath;
        data.basename  = basename;
        data.filename  = file.filename(filepath);
        data.pagename  = file.filename(filepath);
        data.slug      = data.slug || _str.slugify(data.basename);
        data.id        = data.slug;
        data.title     = data.title || ctx.title || _str.titleize(data.basename);

        // Some of these might come in handy for ordering/sorting
        // or identifying posts, chapters, etc.
        data.index  = i;
        data.number = i + 1;
        data.first  = (i === 0);
        data.prev   = i - 1;
        data.next   = i + 1;
        data.last   = (i === (files.length - 1));

        // Content from src files
        var glob_fn = Handlebars.compile(content);
        data.content = glob_fn(ctx).replace(/^\s+/, '');

        if((opts.marked && opts.marked.process === true) || hash.markdown) {
          data.content = marked(data.content);
        }

        // Content from inside the block
        var output = options.fn(ctx, {data: data});

        // Prepend output with the filepath to the original partial
        if (options.origin && options.origin === true) {
          output = '<!-- ' + filepath + ' -->\n' + output;
        }

        return {
          data: data,
          content: output
        };
      }).sort(options.compare || compareFn).map(function (obj) {
        if(options.debug) {file.writeDataSync(options.debug, obj);}

        // Return content from src files
        return obj.content;
      }).join(options.sep);

      result += src;
    });
    return new Handlebars.SafeString(result);
  });

  /**
   * Process templates using grunt.config.data and context
   */
  var processContext = function (grunt, context) {
    grunt.config.data = _.defaults(context || {}, _.cloneDeep(grunt.config.data));
    return grunt.config.process(grunt.config.data);
  };
};
