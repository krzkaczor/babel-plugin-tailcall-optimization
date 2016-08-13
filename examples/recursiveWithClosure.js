// based on https://phabricator.babeljs.io/T6869
const buttons = document.getElementsByTagName('button')

const printIndex = (index = 2) => {
  buttons.item(index).addEventListener('click', () => console.log(index))
  if (index) return printIndex(index - 1)
}

module.exports = printIndex
