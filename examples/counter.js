function counter (n, acc = 0) {
  if (n === 0) {
    return acc
  } else {
    return counter(n - 1, acc + 1)
  }
}

module.exports = counter
