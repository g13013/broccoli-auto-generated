/**
* A very simple lightweight logicless mustache template processor
*/


module.exports = function (template, hash) {
  var holderRe = /\{\{([^}]*?)\}\}/g;
  template = template || '';
  template = template.replace(holderRe, function (match, key) {
    var value = hash[key];
    if (typeof value === 'function') {
      value = value(hash);
    }
    return value || '';
  });
  return template;
};
