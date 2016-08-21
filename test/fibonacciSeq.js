const expect = require('chai').expect
const {withExample} = require('../testUtils')

describe('Fibonacci example', withExample('fibonacciSeq.js')(function () {
  it('should work with TCO plugin', function () {
    const fib = this.module

    expect(fib(10)).to.be.eq(55)
    expect(fib(20)).to.be.eq(6765)
    expect(fib(200)).to.be.eq(280571172992510140037611932413038677189525)
  })
}))
