/**
 * Handlebars Helper: {{last 5}}
 * https://github.com/helpers/handlebars-helper-compose
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * https://github.com/jonschlinkert
 * Licensed under the MIT license.
 */

// node_modules
var _ = require('lodash');

module.exports.register = function (Handlebars, options, params) {

  'use strict';

  var opts = options || {};

  Handlebars.registerHelper('last',function(context, num) {
    var result = context.slice(Math.max(context.length - num, 0));
    return new Handlebars.SafeString(result);
  });
};