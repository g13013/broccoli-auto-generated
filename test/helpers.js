//helper that creates a mocked readTree function to submit to the writer
exports.makeReadTree = function makeReadTree(srcDir, obj) {
  obj.dirs = obj.dirs || {};
  obj.dirs[srcDir] = obj.tree;
  return function () {
    return {
      then: function (callback) { callback(srcDir); }
    };
  };
};

//Mocks
exports.writeFile = function writeFile(path, content) {
  this.writtenFiles.push({path: path, content: content});
};

exports.mkdirpSync = function mkdirpSync(/*path*, content*/) {
  //DO NOTHING
};

exports.readFile = function readFile(path) {
  if (path in this.tree) {
    this.readFiles.push(path);
    return this.tree[path].content || '';
  } else {
    throw new Error('Error: ENOENT, no such file or directory \'' + path + '\'');
  }
};

exports.hashStats = function hashStats(stats, path) {
  if (path in this.tree) {
    this.readStats.push(path);
    return this.tree[path].hash || '-1';
  } else {
    throw new Error('Error: ENOENT, no such file or directory \'' + path + '\'');
  }
};
