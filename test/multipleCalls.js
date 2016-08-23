const expect = require('chai').expect
const { withExample } = require('../testUtils')

describe('Multiple tail calls calls example', withExample('multipleCalls.js')(function () {
  it('should work for small n without TCO plugin', function () {
    const counter = this.rawModule

    expect(counter(111)).to.be.eq(2109)
  })

  it('should fail for big n without TCO plugin', function () {
    const counter = this.rawModule

    expect(() => counter(1000 * 1000)).to.throw()
  })

  it('should work for small n with TCO plugin', function () {
    const counter = this.module

    expect(counter(111)).to.be.eq(2109)
  })

  it('should work for big n with TCO plugin', function () {
    const counter = this.module

    expect(counter(100 * 1000)).to.be.eq(9991009)
  })
}))
