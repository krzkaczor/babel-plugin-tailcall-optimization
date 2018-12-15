const fs = require('fs')
const { join } = require('path')
const babel = require('@babel/core')

function withExample (exampleName) {
  return (testSuite) => function () {
    const exampleRelativePath = `./examples/${exampleName}`
    const exampleCode = fs.readFileSync(join(__dirname, exampleRelativePath)).toString()

    this.ctx.rawModule = require(exampleRelativePath)
    const { module, transpiledCode } = compileAndGetModule(exampleCode)
    this.ctx.module = module
    this.ctx.transpiledCode = transpiledCode

    testSuite.apply(this)
  }
}

function optimizeTailCalls (path) {
  const rawJsCode = fs.readFileSync(path).toString()
  const { module } = compileAndGetModule(rawJsCode)

  return module
}

function compileAndGetModule (code) {
  const pluginPath = require.resolve('./build/lib.js')
  const output = babel.transform(code, {
    plugins: [ pluginPath ]
  })

  return { module: getModule(output.code), transpiledCode: output.code }
}

function getModule (code) {
  const module = {}
  /* eslint-disable */
  eval(code)
  /* eslint-enable */

  return module.exports
}

module.exports = {
  withExample,
  optimizeTailCalls,
  compileAndGetModule,
  getModule
}
