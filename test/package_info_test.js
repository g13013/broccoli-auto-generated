'use strict';
var rewire = require('rewire');
var testObject = {};

testObject['Package info'] = {
  existing: function (test) {
    test.expect(4);

    var pkgInfo = rewire('../lib/package_info');
    var content = [
      '{"name": "okg name"',
      '"version": "0.0.2"',
      '"description": "some desc"',
      '"license": "MIT"}'
    ];
  
    /*jshint camelcase:false*/
    pkgInfo.__set__({
      fs: {
        existsSync: function () {
          test.ok(true);
          return true;
        },
        readFileSync: function () {
          test.ok(true, 'Should call readFileSync');
          return content.join();
        }
      }
    });

    var info = pkgInfo();
    test.deepEqual(info, {
      packageName: 'okg name',
      packageVersion: '0.0.2',
      packageDescription: 'some desc',
      packageLicense: 'MIT'
    }, 'Should return the correct info about current package');

    var newInfo = pkgInfo();
    test.strictEqual(info, newInfo, 'Should return a cached object');

    test.done();
  },
  missing: function (test) {
    test.expect(2);
    var pkgInfo = rewire('../lib/package_info');

    /*jshint camelcase:false*/
    pkgInfo.__set__({
      fs: {
        existsSync: function () {
          test.ok(true, 'Should call existsSync');
          return false;
        },
        readFileSync: function () {
          test.ok(true, 'Should not call readFileSync');
        }
      }
    });

    var info = pkgInfo();
    test.deepEqual(info, {
      packageName: '',
      packageVersion: '',
      packageDescription: '',
      packageLicense: ''
    }, 'Should return and object with empty string values');

    test.done();
  }
};

module.exports = testObject;
