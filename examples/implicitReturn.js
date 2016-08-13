function counter (n, acc = 0) {
  if (n === 0) {
    return acc
  } if (n > 0) {
    return counter(n - 1, acc + 1)
  }
}

module.exports = counter
