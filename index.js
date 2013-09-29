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
var grunt = require('grunt');
var glob  = require('globule');
var yfm   = require('assemble-yaml');
var _     = require('lodash');


module.exports.register = function(Handlebars, options) {

  // If the 'assemble.options' object exists, use it
  var assembleOpts = options || {};

  Handlebars.registerHelper("compose", function(src, options, compare_fn) {

    // Default options
    var opts = {
      sep: '\n',
      cwd: '',
      glob: {}
    };
    options = _.defaults(options, assembleOpts.compose, opts);

    var content;
    compare_fn = (compare_fn || options.compare || compareFn);
    var index = 0;

    // Join path to 'cwd' if defined in the helper's options
    var cwd = path.join.bind(null, options.cwd, '');

    return glob.find(cwd(src), options.glob).map(function (path) {
      var context = yfm.extract(path).context;
      var content = yfm.extract(path).content;
      index += 1;
      return {
        index: index,
        path: path,
        context: processContext(grunt, _.defaults({content: content}, context)),
        content: content
      };
    }).sort(compare_fn).map(function (obj) {
      var template = Handlebars.compile(options.fn(obj.context));
      return new Handlebars.SafeString(template(obj.context));
    }).join(options.sep);
  });

};


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