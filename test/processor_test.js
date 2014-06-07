var processor = require('../lib/processor');

module.exports = {
  setUp: function (cb) {cb()},
  tearDown: function (cb) {cb()},
  processor: function (test) {
    var template = '{{val1}}/{{val2}}/{{val3}}/{{val1}}/{{val1}}';
    var values = {
      val1: '1',
      val2: function () {
        return '2';
      },
      val3: 3
    };
    test.equal('1/2/3/1/1', processor(template, values), 'Should render the template correclty');
    test.done();
  }
};
