const expect = require('chai').expect
const {withExample} = require('../testUtils')

describe('Counter example', withExample('counter.js')(function () {
  it('should fail without TCO plugin', function () {
    const counter = this.rawModule

    expect(() => counter(1000 * 1000)).to.throw('Maximum call stack size exceeded')
  })

  it('should work with TCO plugin', function () {
    const counter = this.module

    expect(counter(1000 * 1000)).to.be.eq(1000000)
  })
}))
