# babel-plugin-tailcall-optimization
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Tail call optimization for JavaScript!

## Status
This is correctly optimized:
```
function counter (n, acc = 0) {
  if (n === 0) {
    return acc
  } if (n > 0) {
    return counter(n - 1, acc + 1)
  }
}
```

## Todo:
 - proper recognizing TCOs (now only function declaration node is checked)
 - work around TCOs & closures
 - test with bigger code base
 - examples including traditional tail called recursions (Fibonacci etc)