'use strict';
var testObject = require('./mock_setup.js')();

testObject['Single file'] = function (test) {
  var generator = this.injectAll().getModule()(this.tree, {
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
};

module.exports = testObject;
