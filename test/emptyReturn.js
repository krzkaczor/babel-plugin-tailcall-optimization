const expect = require('chai').expect
const {withExample} = require('../testUtils')

describe('Transpiling empty return example', function () {
  it('should not throw', function () {
    expect(function () {
      withExample('emptyReturn.js')(function () {}).call({ctx: {}})
    }).to.not.throw()
  })
})
