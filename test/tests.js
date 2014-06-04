var dirs = {};
var fs = require('fs');
var walkSync = require('walk-sync');
var walkSyncModulePath = require.resolve('walk-sync');
var helpers = require('broccoli-kitchen-sink-helpers');
var mkdirp = require('mkdirp');
var testHelpers = require('./helpers');
var _walkSync  = require.cache[walkSyncModulePath].exports;
var _hashStats = helpers.hashStats;
var _writeFileSync = fs.writeFileSync;
var _readFileSync = fs.readFileSync;
var _statSync = fs.statSync;
var _mkdirpSync = mkdirp.sync;

require.cache[walkSyncModulePath].exports = function (dir) {
  return dirs[dir] && Object.keys(dirs[dir]).map(function (file) {return file.replace(dir + '/', '');}) || walkSync(dir);
};

var generateFiles = require('../');

module.exports = {
  setUp: function (callback) {
    this.tree = {};
    this.writtenFiles = [];
    this.readFiles = [];
    this.readStats = [];
    fs.writeFileSync = testHelpers.writeFile.bind(this);
    fs.readFileSync = testHelpers.readFile.bind(this);
    mkdirp.sync = testHelpers.mkdirpSync;
    helpers.hashStats = testHelpers.hashStats.bind(this);
    callback();
  },
  tearDown: function (callback) {
    // clean up
    fs.writeFileSync = _writeFileSync;
    fs.readFileSync = _readFileSync;
    mkdirp.sync = _mkdirpSync;
    helpers.hashStats = _hashStats;
    callback();
  },
  simpleTemplate: function (test) {
    var generator = generateFiles(this.tree, {
          noDefaults: true,
          file: 'dest_file.js',
          template: '{{prop1}}: {{value1}}\n{{prop2}}: {{value2}}',
          values: {
            prop1: 'simpleProp',
            value1: 'simple value',
            prop2: function () {
              return 'functionProp';
            },
            value2: 'dynamic value'
          }
        });
    var destTree = [{path: 'dest_folder/dest_file.js', content: 'simpleProp: simple value\nfunctionProp: dynamic value'}];
    // We do not submit readTree function as it is not
    // supposed to be used when using with single template file, that's why we use an assert
    test.doesNotThrow(generator.write.bind(generator, null, 'dest_folder'), 'TypeError: object is not a function', 'Must not try to read tree');
    test.deepEqual(this.writtenFiles, destTree, 'Must have wrote files correctly');
    test.done();
  },
  templateFiles: function (test) {
    var srcDir = 'src_dir';
    var generator = generateFiles(this.tree, {
          noDefaults: true,
          destDir: 'sub_dir',
          values: {
            prop1: 'simpleProp',
            value1: 'simple value',
            prop2: function () {
              return 'functionProp';
            },
            value2: 'dynamic value'
          }
        });

    this.tree[srcDir + '/file1'] = {hash: '0', content: '{{prop1}}'};
    this.tree[srcDir + '/file2'] = {hash: '0', content: '{{value1}}'};
    this.tree[srcDir + '/file3'] = {hash: '0', content: '{{prop2}}'};
    this.tree[srcDir + '/file4'] = {hash: '0', content: '{{value2}}'};
    dirs[srcDir] = this.tree;

    var destTree = [
      {path: 'dest_folder/file1', content: 'simpleProp'},
      {path: 'dest_folder/file2', content: 'simple value'},
      {path: 'dest_folder/file3', content: 'functionProp'},
      {path: 'dest_folder/file4', content: 'dynamic value'}
    ];
    // We do not submit readTree function as it is not
    // supposed to be used when using with single template file, that's why we use an assert
    generator.write(testHelpers.makeReadTree(srcDir) , 'dest_folder');
    test.deepEqual(this.writtenFiles, destTree, 'Must have wrote files correctly');
    test.done();
  }
};
