'use strict';
var testObject = require('./mock_setup.js')();
var testHelpers = require('./helpers');
var generateFiles = require('../');

testObject['Simple tree'] = function (test) {
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

  var destTree = [
    {path: 'dest_folder/file1', content: 'simpleProp'},
    {path: 'dest_folder/file2', content: 'simple value'},
    {path: 'dest_folder/file3', content: 'functionProp'},
    {path: 'dest_folder/file4', content: 'dynamic value'}
  ];
  // We do not submit readTree function as it is not
  // supposed to be used when using with single template file, that's why we use an assert
  generator.write(testHelpers.makeReadTree(srcDir, this) , 'dest_folder');
  test.deepEqual(this.writtenFiles, destTree, 'Must have wrote files correctly');
  test.done();
};

module.exports = testObject;
