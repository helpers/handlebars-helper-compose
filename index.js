/**
 * {{compose}}
 *
 * https://github.com/helpers/compose
 * Copyright (c) 2013 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */


'use strict';

// Node.js modules
var path  = require('path');

// node_modules
var yfm   = require('assemble-yaml');
var _     = require('lodash');


module.exports.register = function(Handlebars, options, params) {

  // If the 'assemble.options' object exists, use it
  var opts     = options || {};
  var grunt    = params.grunt;
  var assemble = params.assemble;


  Handlebars.registerHelper("compose", function(src, options, compare_fn) {
    var hash = options.hash || {};

    // Default options
    options = _.extend({
      cwd: '',
      sep: '',
      glob: {}
    }, options, opts.data, opts.compose, hash);

    // Join path to 'cwd' if defined in the helper's options
    var cwd = path.join.bind(null, options.cwd);
    grunt.verbose.ok("cwd:".yellow, cwd(src));

    // Compare function, for sorting.
    compare_fn = (compare_fn || options.compare || compareFn);
    var index = 0;

    var content;
    var html = grunt.file.expand(options.glob, cwd(src)).map(function (file) {
      var context = yfm.extract(file).context;
      var content = yfm.extract(file).content;

      index += 1;
      return {
        index: index,
        number: index + 1,
        file: file,
        id: path.basename(file, path.extname(file)),
        context: processContext(grunt, _.defaults({content: content}, context)),
        content: content
      };
    }).sort(compare_fn).map(function (obj) {

      // promote id into context
      obj.context.id = obj.id;
      var template = Handlebars.compile(options.fn(obj.context) + obj.content);
      return template(obj.context);

    }).join(options.sep);

    return new Handlebars.SafeString(html);
  });


  /**
   * Process templates using grunt config data and context
   */
  var processContext = function(grunt, context) {
    grunt.config.data = _.defaults(context || {}, _.cloneDeep(grunt.config.data));
    return grunt.config.process(grunt.config.data);
  };


  /**
   * Accepts two objects (a, b),
   * @param  {Object} a
   * @param  {Object} b
   * @return {Number} returns 1 if (a >= b), otherwise -1
   */
  var compareFn = function(a, b) {
    return a.index >= b.index ? 1 : -1;
  };
};

