const weirdCounter = (n, acc = 0) => (
  n <= 0 ? acc
  : n < 10 ? weirdCounter(n - 1, acc + 1)
  : n < 100 ? weirdCounter(n - 1, acc + 10)
  : weirdCounter(n - 1, acc + 100)
)

module.exports = weirdCounter
