# babel-plugin-tailcall-optimization
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Tail call optimization for JavaScript!

## Installation

```bash
npm install babel-plugin-tailcall-optimization --save-dev
```

and add to your `.babelrc`:

```js
"plugins": ["tailcall-optimization"]
```


## How does it work?
We rewrite functions with tail calls to ones using while loops. Original function with tail call:
```js
function counter (n, acc = 0) {
  if (n === 0) {
    return acc
  } else {
    return counter(n - 1, acc + 1)
  }
}
```

gets rewritten to this:
```js
function counter(n, acc = 0) {
  var _repeat = true;

  var _n, _acc;

  while (_repeat) {
    _repeat = false;

    if (n === 0) {
      return acc;
    } else {
      _n = n - 1
      _acc = acc + 1
      n = _n
      acc = _acc
      _repeat = true;
      continue;
    }
  }
}
```
Plugin does not affect functions without TCOs so it's safe to use.

## Benchmarks
For [Fibonacci Sequence example](https://github.com/krzkaczor/babel-plugin-tailcall-optimization/blob/master/examples/fibonacciSeq.js) benchmark.js results are:

```
Fibonacci Sequence without TCO x 270,170 ops/sec ±1.14% (85 runs sampled)
Fibonacci Sequence with TCO x 1,298,276 ops/sec ±1.24% (83 runs sampled)
```

So function after TCO optimization is almost **5 times faster**.

[Benchmark code](https://github.com/krzkaczor/babel-plugin-tailcall-optimization/blob/master/benchmark/fibonacciSeq.js)
 
## Known issues
Currently when plugin detects function creation within tailcalled function it does not optimize it. It's releated to this bug in old babel implementation:  https://phabricator.babeljs.io/T6869

It does not work for mutual recursive functions. I guess it's not super big problem - even JVM does not do this.
