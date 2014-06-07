var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var pick = require('broccoli-static-compiler');
var walkSync = require('walk-sync');
var gitInfo = require('git_info');
var processor = require('./processor');
var packageInfo = require('./package_info');
var Writer = require('broccoli-writer');


function merge(obj1, obj2) {
  var key;
  obj1 = obj1 || {};
  obj2 = obj2 || {};
  for (key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      obj1[key] = obj2[key];
    }
  }
  return obj1;
}

function writeFile(filePath, content) {
  var dir = path.dirname(filePath);
  if (dir && !fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }
  fs.writeFileSync(filePath, content);
}

function AutoGenerate(inputTree, options) {
  if (!(this instanceof AutoGenerate)){
    return new AutoGenerate(inputTree, options);
  }

  var values;
  options = options || {};

  //default values
  if (!options.noDefaults) {
    values = packageInfo();
    merge(values, gitInfo());
    values.license = '';
    //merge user values
    this.values = merge(values, options.values);
  } else {
    this.values = options.values || {};
  }

  if (!options.file) {
    options.files = options.files && [].concat(options.files) || ['*']; //must be array

    this.inputTree = pick(inputTree, {
      srcDir: options.srcDir || '/',
      files: options.files,
      destDir: options.destDir || '/'
    });
  }


  //Read license content
  if (options.licenseFile && fs.existsSync(options.licenseFile)) {
    values.license = fs.readFileSync(options.licenseFile, 'UTF-8');
  }

  this.options = options;

  //template processor
  this.process = this.options.processor || processor;
}

AutoGenerate.prototype = Object.create(Writer.prototype);
AutoGenerate.prototype.constructor = AutoGenerate;
AutoGenerate.prototype.write = function (readTree, destDir) {
  var i, content;
  var self = this;
  var options = self.options;
  var template = options.template;
  var file = options.file;
  var values = this.values;

  //if file is defined within options we process content and output file to destDir
  if (file) {
    content = this.process(template, values);
    writeFile(destDir + '/' + file, content);
    return destDir;
  }

  //Otherewise we process all files
  if (!this.inputTree) {
    return;
  }

  return readTree(this.inputTree).then(function (srcDir) {
    var path;
    var paths = walkSync(srcDir);
    //read every file and process content using values
    //TODO implement cache
    try {
      for (i = 0; i < paths.length; i++) {
        path = paths[i];
        if (path.substr(-1) === '/') {
          continue;
        }
        template = fs.readFileSync(srcDir + '/' + path, 'UTF-8');
        content = self.process(template, values);
        writeFile(destDir + '/' + path, content);
      }
    } catch(err) {
      console.log('[broccoli-auto-generated] Error processing file', file, '\n\t', err.message, err.stack);
    }
    return destDir;
  });
};

module.exports = AutoGenerate;
