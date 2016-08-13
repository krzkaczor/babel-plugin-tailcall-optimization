const expect = require('chai').expect
const {withExample} = require('../testUtils')

describe('Implicit return', withExample('implicitReturn.js')(function () {
  this.timeout(1000)

  it('should work with TCO plugin', function () {
    expect(this.module(-5)).to.be.eq(this.module(-5))
  })
}))
