exports.walkSync = function (dir) {
  return Object.keys(this.tree).map(function (file) {
    return file.replace(dir + '/', '');
  });
};

exports.writeFile = function writeFile(path, content) {
  this.writtenFiles.push({path: path, content: content});
};

exports.mkdirpSync = function mkdirpSync(path) {
  this.createdDirectories.push(path);
};

exports.existsSync = function existsSync(path) {
  return this.createdDirectories.indexOf() > -1 || this.writtenFiles.indexOf(path) > -1;
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
