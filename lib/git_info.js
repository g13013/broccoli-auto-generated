var fs = require('fs');
var empty = {//return empty values to prevent 'undefined' in strings
  gitBranch: '',
  gitRev: '',
  gitShortRev: ''
};

function readInfo(dir) {
  var re, ref, head;
  var sha = '';
  var branch = 'HEAD'; //default if detached
  if (!fs.existsSync(dir +'/HEAD')) {
    return empty;
  }
  ref = fs.readFileSync(dir +'/HEAD', 'UTF-8');
  head = /(ref\: )?(.+)\s$/.exec(ref);
  if (head) {
    //if it's a branch, we read the rev from it's ref file
    if (head[1]) {
      ref = head[2];
      branch = ref.replace('refs/heads/', '');
      if (fs.existsSync(dir + '/' + ref)) {
        //read sha from file under refs folder if exists
        sha = fs.readFileSync(dir +'/' + ref, 'UTF-8');
      } else if (fs.existsSync(dir + '/' + 'packed-refs')) {
        //otherwise read it from "packed-refs" file
        re = new RegExp('^([^\\s]{40})\\s' + ref + '$');
        sha = re.exec(fs.readFileSync(dir + '/' + 'packed-refs'));
        sha = sha && sha[1] || '';
      }
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
    //if .git is a file it means that it is a submodule, so we follow the path found in it
    gitDir = fs.readFileSync(gitDir, 'UTF-8').replace('gitdir: ', '');
  }
  return readInfo(gitDir.trim());
};
