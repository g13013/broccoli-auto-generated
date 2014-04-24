# broccoli-auto-generated
A plugin for auto generating files from templates files or the `template` option. Templates should contain mustache placeholders, and
the template processor is intentionally very simple and logicless, if you want more sophisticated template processing, your can set the `processor` option.

Note: It still in beta until version 0.1, use at your own risk.


## Installation

```bash
npm install --save broccoli-auto-generated
```

## Usage

```js
var generatedTree = generate(inputTree, options);

```

If the `file` option is specified, the `inputTree` will be ignored and can be null.

#### Options

```javascript
var options = {
  noDefaults: false,//if true package.json and git info will not be read
  //single file from template
  file: '', // file to output, inputTree will be ignored
  template: '', //Template to process, use this option with the file option

  //or multiple files in directory
  files: [], // files glob filters, default to '["*"]'

  //other options

  srcDir: '', //directory inside the inputTree
  destDir: '', //directory where to output files
  // values is a hash of values to be applied to template files or the
  // `template` option, a value can be a function that expects the values hash as argument.
  values: {
    value1: 'any value',
    value2: function (values) {
      return values.value1;
    }
  }
  // location of license file, relative to process.cwd,
  // the content will be available to use in values.license
  licenseFile: 'path_to_license_file'
  // a custom template processor that will receive two arguments (template, values)
  processor: function (template, values) {}
}
```

#### Default values
Unless `noDefaults` is set to `true`, `broccoli-auto-generated` reads by default the `package.json` file if found,
and some git info of the current project if the `.git` folder or file is found.

######List:

  * `packageName`
  * `packageVersion`
  * `packageDescription`
  * `packageLicense`
  * `license` The content of the license file specified in `options.licenseFile`
  * `gitBranch`
  * `gitRev` Current hash of the last git commit
  * `gitShortRev` Short version of `gitRev`

Note: Your values will be merged with the default values and will take precedence if key names conflict.

```javascript
var generate = require('broccoli-auto-generated');

//process "generator/*" files with default values
var tree1 = generate('generator');

//process "generator" folder files with values, license content and default values
var tree2 = generate('generator', {
      values: {myVar: 'A value'}
      licenseFile: 'license.md'
    });

//Output "path/to/version.js" file with content from template with value of version from  `package.json`
var tree3 = generate(null, {
      file: 'path/to/version.js',
      template: 'export default VERSION = "{{packageVersion}}"'
    });
```


##License
[MIT](https://github.com/g13013/broccoli-auto-generated/blob/master/LICENSE.md)
