// based on https://phabricator.babeljs.io/T6869

const generatePrinters = (index = 10, printers = []) => {
  printers.push(() => index)
  if (index > 0) {
    return generatePrinters(index - 1, printers)
  } else {
    return printers
  }
}

module.exports = generatePrinters
