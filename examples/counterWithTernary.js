function counter (n, acc = 0) {
  return n === 0 ? acc : counter(n - 1, acc + 1)
}

module.exports = counter
