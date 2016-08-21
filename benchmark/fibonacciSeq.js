const {join} = require('path')

const fibSeq = require('../examples/fibonacciSeq')

// use our plugin to get tail-call-optimized version fibSeq function
const {optimizeTailCalls} = require('../testUtils')
const fibSeqOptimized = optimizeTailCalls(join(__dirname, '../examples/fibonacciSeq.js'))

// create benchmark
const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()

suite
  .add('Fibonacci Sequence without TCO', () => fibSeq(200) === 280571172992510140037611932413038677189525)
  .add('Fibonacci Sequence with TCO', () => fibSeqOptimized(200) === 280571172992510140037611932413038677189525)

suite
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()
