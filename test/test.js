const expect = require('chai').expect
const babel = require('babel-core')

const code = `
      function test(a) {
        if (a === 100000000) return true; 
        return test(a + 1);
      }
      
      console.log(test(0))
      `

describe('Trivial example', function () {
  it('should fail without TCO plugin', function () {
    expect(() => run(code)).to.throw()
  })

  it('should work with babel-plugin-tco', function () {
    const runLogs = compileAndRun(code)
    expect(runLogs[0]).to.be.eq(true)
  })
})

function compileAndRun (code) {
  const pluginPath = require.resolve('../build/app.js')
  const output = babel.transform(code, {
    plugins: [ pluginPath ]
  })

  return run(output.code)
}

function run (code) {
  const logs = []
  /* eslint-disable */
  const console = {
    log: (val) => logs.push(val)
  }
  eval(code)
  /* eslint-enable */

  return logs
}
