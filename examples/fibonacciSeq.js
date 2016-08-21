const fib = function (n, last = 1, beforeLast = 0) {
  if (n === 0) {
    return beforeLast
  }

  return fib(n - 1, last + beforeLast, last)
}

module.exports = fib
