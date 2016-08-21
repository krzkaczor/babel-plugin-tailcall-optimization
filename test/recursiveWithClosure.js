const expect = require('chai').expect
const {withExample} = require('../testUtils')

describe('Recursion with closures', withExample('recursiveWithClosure.js')(function () {
  it('should work without TCO optimization for simple case', function () {
    const printers = this.rawModule(5)

    expect(printers[0]()).to.be.eq(5)
    expect(printers[1]()).to.be.eq(4)
  })

  it('should work with TCO optimization for simple case', function () {
    const printers = this.module(5)

    expect(printers[0]()).to.be.eq(5)
    expect(printers[1]()).to.be.eq(4)
  })

  it('should not work without TCO optimization for bigger n', function () {
    expect(() => this.rawModule(50000)).to.throw()
  })

  // for now it's not implemented
  it.skip('should work with TCO optimization for bigger n', function () {
    const printers = this.module(50000)

    expect(printers[0]()).to.be.eq(50000)
    expect(printers[1]()).to.be.eq(49999)
  })
}))
