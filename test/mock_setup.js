'use strict';
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
var _mkdirpSync = mkdirp.sync;

module.exports = function (dirs) {
  dirs = dirs || {};

  require.cache[walkSyncModulePath].exports = function (dir) {
    return dirs[dir] && Object.keys(dirs[dir]).map(function (file) {
      return file.replace(dir + '/', '');
    }) || walkSync(dir);
  };

  return {
    setUp: function (callback) {
      this.dirs = dirs;
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
      fs.writeFileSync = _writeFileSync;
      fs.readFileSync = _readFileSync;
      mkdirp.sync = _mkdirpSync;
      helpers.hashStats = _hashStats;
      require.cache[walkSyncModulePath].exports = _walkSync;
      callback();
    }
  };
};
