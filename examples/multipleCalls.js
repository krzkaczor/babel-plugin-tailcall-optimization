function weirdCounter (n, acc = 0) {
  if (n <= 0) {
    return acc
  }

  if (n < 10) {
    return weirdCounter(n - 1, acc + 1)
  }

  if (n < 100) {
    return weirdCounter(n - 1, acc + 10)
  }

  return weirdCounter(n - 1, acc + 100)
}

module.exports = weirdCounter
