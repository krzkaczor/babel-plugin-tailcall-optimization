const inFunctionTraversal = {
  ReturnStatement (path) {
    if (path.node.argument && path.node.argument.type === 'CallExpression' && path.node.argument.callee.name === this.functionName) {
      this.tailCalls.push(path)
    }
  },

  FunctionDeclaration () {
    this.needsClosure = true
  },

  ArrowFunctionExpression () {
    this.needsClosure = true
  },

  FunctionExpression () {
    this.needsClosure = true
  }
}

function findTailCalls (fnPath, fnName) {
  const traverseContext = { tailCalls: [], functionName: fnName }
  fnPath.traverse(inFunctionTraversal, traverseContext)

  return { tailCalls: traverseContext.tailCalls, needsClosure: traverseContext.needsClosure }
}

module.exports = findTailCalls
