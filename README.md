# {{compose}} [![NPM version](https://badge.fury.io/js/handlebars-helper-compose.png)](http://badge.fury.io/js/handlebars-helper-compose)

> {{compose}} handlebars helper. Inlines content from multiple files optionally using wildcard (globbing/minimatch) patterns, extracts YAML front matter to pass to context for each file. Accepts compare function as 3rd parameter for sorting inlined files.

## Quickstart
In the root of your project, run the following in the command line:

```bash
npm i handlebars-helper-compose --save-dev
```

Next, in your Gruntfile, simply add `handlebars-helper-compose` to the `helpers` property in the [Assemble](http://assemble.io) task or target options:

```javascript
grunt.initConfig({
  assemble: {
    options: {
      // the 'handlebars-helper-compose' modules must also be listed in devDependencies
      // for assemble to automatically resolve the helper
      helpers: ['handlebars-helper-compose']
    }
    files: {
      '_gh_pages/': ['templates/*.hbs']
    }
  }
});
```

With that completed, you may now use the `{{compose}}` helper in your templates:

```handlebars
{{compose src="blog/posts/*.md"}}
  <h1>Title: {{@title}}</h1>
  {{{@content}}}</p>
{{/compose}}
```
Note that the path used in the `src` hash option is relative to the project root (e.g. Gruntfile).


## Context & Lo-Dash templates

The helper will also process any valid Lo-Dash templates in the YAML front matter of any targeted files. For example:

```handlebars
---
title: <%= blog.title %>
post: 1
heading: <%= blog.title %> | Blog <%= post %>
---
<h1>{{title}}</h1>
<p class="heading">{{heading}}</p>
```



## Options

### src
Type: `String` (optional)

Default: `undefined`

The file path of the file(s) to include. Glob patterns may be used.

### cwd
Type: `String` (optional)

Default: `undefined`

The `cwd` for paths defined in the helper.

### sep
Type: `String`

Default: `\n`

The separator to append after each inlined file.

### marked
Type: `Object`

Default: `\n`

The separator to append after each inlined file.

### filter
Type: `function`

Default: `undefined`

A custom function for filtering the array of paths returned from the `src` property. This could potentially be more flexible, please make a feature request if you have a use case.

### compare
Type: `Function`

Default: `function(a, b) {return a.index >= b.index ? 1 : -1;}`

Compare function for sorting the aggregated files.





## Defining options

### "assemble" task options

> If you use Grunt and [Assemble](http://assemble.io), you can pass options from the `assemble` task in the Gruntfile to the helper.

In your project's Gruntfile, options for the `{{#compose}}...{{/compose}}` helper can be defined in the Assemble task options:

```javascript
assemble: {
  options: {
    helpers: ['handlebars-helper-compose', 'foo/*.js'],
    compose: {
      cwd: './posts',
      sep: '<!-- post -->',
      compare: function(a, b) {
        return a.index >= b.index ? 1 : -1;
      }
    }
  },
  files: {}
}
```

Note that the options are defined in `options: {compose: {}}`, which is registered by this helper as a [custom property](http://assemble.io/docs/Custom-Helpers.html) in the Assemble options.



## Examples

### all options

```js
assemble: {
  options: {
    compose: {
      cwd: 'posts',
      sep: '<!-- post -->',
      compare: function(a, b) {
        return a.index >= b.index ? 1 : -1;
      }
    }
  }
}
```

### filtering

Example: return only the last two items from the `src` files array:

```js
assemble: {
  options: {
    compose: {
      cwd: 'posts',
      sep: '<!-- post -->',
      filter: function(arr) {
        return arr.slice(Math.max(arr.length - 2, 0));
      }
    }
  }
}
```



### cwd option

Instead of defining the entire path in the `src` hash option, like this:

```handlebars
{{compose src="path/to/my/blog/posts/*.md"}}
  <h1>{{@title}}</h1>
  {{@content}}
{{/compose}}
```

You could define the `cwd` in the `compose` options in your project's Gruntfile:

```javascript
assemble: {
  options: {
    helpers: ['helper-compose'],
    compose: {
      cwd: 'path/to/my/blog'
    }
  }
}
```
and then define paths in the templates like this:

```handlebars
{{compose 'posts/*.md'}}
  <h1>{{@title}}</h1>
  {{@content}}
{{/compose}}
```

## Usage example

In our Gruntfile, let's say we have the following config:

```js
// Project configuration.
grunt.initConfig({

  // Metadata for our blog.
  blog: require('./test/fixtures/blog/blog.yml'),
  assemble: {
    options: {
      helpers: ['handlebars-helper-compose'],
      compose: {
        cwd: 'blog',
        sep: '<!-- post -->'
      }
    },
    blog: {
      src: ['index.hbs'],
      dest: 'blog/'
    }
  }
});
```

### page

...and `index.hbs` file contains the following:


```handlebars
<!-- post -->
{{#compose src="posts/*.md" sep="<!-- post -->"}}
  <h1>{{blog.title}}</h1>
  <h2>Post title: {{@title}}</h2>
  <p>{{{@content}}}</p>
{{/compose}}
```

### posts
..and we have a few posts, `monday.md`, `tuesday.md`, and `wednesday.md`, for example:

```handlebars
---
title: Monday
---

This is the {{title}} post...
```

### result

The result, `blog/index.html` would look something like:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My Brilliant Blog</title>
  </head>
  <body>

    <!-- post -->
    <h1>My Brilliant Blog</h1>
    <h2>Post title: Monday</h2>
    <p>This is the Monday post...</p>

    <!-- post -->
    <h1>My Brilliant Blog</h1>
    <h2>Post title: Tuesday</h2>
    <p>This is the Tuesday post...</p>

    <!-- post -->
    <h1>My Brilliant Blog</h1>
    <h2>Post title: Wednesday</h2>
    <p>This is the Wednesday post...</p>
  </body>
</html>
```


## Author

**Jon Schlinkert**

+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)
+ [github/jonschlinkert](http://github.com/jonschlinkert)


## License and Copyright
Licensed under the [MIT License](./LICENSE-MIT).
Copyright (c) 2014 Jon Schlinkert, contributors.
