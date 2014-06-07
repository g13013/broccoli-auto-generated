'use strict';
var testHelpers = require('./mock_func');
var rewire = require('rewire');

module.exports = function () {
  return {
    setUp: function (callback) {
      var testedModule = rewire('../');

      this.tree = {};
      this.writtenFiles = [];
      this.readFiles = [];
      this.createdDirectories = [];
      this.readStats = [];

      this.getModule = function () {
        return testedModule;
      };


      this.injectAll = function () {/*jshint camelcase:false*/
        testedModule.__set__({
          walkSync: testHelpers.walkSync.bind(this),
          fs: {
            readFileSync: testHelpers.readFile.bind(this),
            writeFileSync: testHelpers.writeFile.bind(this),
            existsSync: testHelpers.existsSync.bind(this)
          },
          mkdirp: {
            sync: testHelpers.mkdirpSync.bind(this)
          },
          helpers: {
            hashStats: testHelpers.hashStats.bind(this)
          }
        });
        return this;
      };

      this.inject = function (obj) {/*jshint camelcase:false*/
        testedModule.__set__(obj);
        return this;
      };

      this.getVar = function (varName) {/*jshint camelcase:false*/
        return testedModule.__get__(varName);
      };

      callback();
    }
  };
};
