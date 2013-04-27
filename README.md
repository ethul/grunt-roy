# Grunt Roy

Invokes the [Roy](http://roy.brianmckenna.org/) compiler through
[Grunt](http://gruntjs.com). [Roy](http://roy.brianmckenna.org/) is a
functional programming language that compiles to JavaScript.

## Getting Started
From the same directory as your project's `Gruntfile.js` and `package.json`
file, install this plugin with the following command.

```bash
npm install grunt-roy --save-dev
```

Once that's done, add the following line to your project's `Gruntfile.js`
file.

```js
grunt.loadNpmTasks('grunt-roy');
```

If the plugin has been installed correctly, running `grunt --help` at
the command line should list the newly-installed plugin's task or tasks.
In addition, the plugin should be listed in package.json as a
`devDependency`, which ensures that it will be installed whenever the
`npm install` command is run.

## The "roy" task

### Overview
In your project's Gruntfile, add a section named `roy` to the data
object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  roy: {
    app: {
      src: ['lib/**/*.roy'],
      dest: 'public/javascripts',
      options: {
        strict: true,
        sourceMap: true
      }
    }
  }
})
```

### Options

#### options.strict
Type: `Boolean`
Default value: `false`

A Boolean value that when true will insert `"use strict";` into the
compiled JavaScript.

#### options.sourceMap
Type: `Boolean`
Default value: `false`

A Boolean value that when true will generate a source map file
corresponding to each generated JavaScript file. Additionally, the
original Roy source file will be copied to the destination to be made
available for the source mapping.

Note that the source mapping URL will be appended to the compiled
JavaScript file. The value of this URL will be relative so that it may
reference the source map residing in the same directory. The reason this
works is because if you include the JavaScript file with a script tag,
the src attribute of the script tag will be used as the base path for
the source mapping URL.

#### options.nodejs
Type: `Boolean`
Default value: `false`

A Boolean value that when true will not wrap the compiled JavaScript in
an immediately-invoked function expression. Additionally, Roy's `export`
keyword will map to the Nodejs `exports` object. The following is an
example.

```roy
let A = {a: "a"}
export A
```

```js
var A = {
    "a": "a"
};
exports["A"] = A;;
```

When the option value is set to false, an IIFE will wrap the compiled
JavaScript, and Roy's `export` keyword will map to the `this` object.
The following is an example.

```roy
let A = {a: "a"}
export A
```

```js
(function() {
var A = {
    "a": "a"
};
this["A"] = A;;
})();
```
