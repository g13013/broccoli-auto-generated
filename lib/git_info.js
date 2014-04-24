var fs = require('fs');
var empty = {//return empty values to prevent 'undefined' in strings
  gitBranch: '',
  gitRev: '',
  gitShortRev: ''
};

function readInfo(dir) {
  var branch = 'HEAD';
  if (!fs.existsSync(dir +'/HEAD')) {
    return empty;
  }
  var sha = '',
      ref = fs.readFileSync(dir +'/HEAD', 'UTF-8'),
      head = /(ref\: )?(.+)\s$/.exec(ref);
  if (head) {
    //if it's a branch, we read the rev from it's ref file
    if (head[1]) {
      branch = head[2].replace('refs/heads/', '');
      sha = fs.readFileSync(dir +'/' + head[2], 'UTF-8');
    } else {
    // otherwise we return the rev found in the HEAD file
      sha = head[2];
    }
  }
  return {
    gitBranch: branch,
    gitRev: sha.trim(),
    gitShortRev: sha.substr(0, 7), //short rev
  };
}

module.exports = function (gitDir) {
  gitDir = gitDir || '.git';

  if (!fs.existsSync(gitDir)) {
    return empty;
  }

  if (fs.statSync(gitDir).isFile()) {
    gitDir = fs.readFileSync(gitDir, 'UTF-8').replace('gitdir: ', '');
  }
  return readInfo(gitDir);
};
