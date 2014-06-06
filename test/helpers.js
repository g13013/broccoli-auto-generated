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
