var info;
var fs = require('fs');

function read() {
  if (info) {
    return info;
  }

  var content;
  if (!fs.existsSync('package.json')) {
    info = { //return empty values to prevent 'undefined' in strings
      packageName: '',
      packageVersion: '',
      packageDescription: '',
      packageLicense: ''
    };
  } else {
    content = fs.readFileSync('package.json', 'UTF-8');
    json = JSON.parse(content);
    info = {
      packageName: json.name,
      packageVersion: json.version,
      packageDescription: json.description,
      packageLicense: json.license
    };
  }
  return info;
}

module.exports = read;
