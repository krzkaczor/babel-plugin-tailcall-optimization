const isCallExpressionWithTco = (functionName, node) => {
  return (
    (node.type === 'CallExpression' && node.callee.name === functionName)
  )
}

const isConditionalExpressionWithTco = (functionName, node) => {
  if (node.type === 'ConditionalExpression') {
    const { consequent, alternate } = node

    return (
      isExpressionWithTco(functionName, consequent) ||
      isExpressionWithTco(functionName, alternate)
    )
  }

  return false
}

const isExpressionWithTco = (functionName, node) => {
  return (
    isCallExpressionWithTco(functionName, node) ||
    isConditionalExpressionWithTco(functionName, node)
  )
}

const inFunctionTraversal = {
  ConditionalExpression (path) {
    if (path.parent.type === 'ArrowFunctionExpression' && isConditionalExpressionWithTco(this.functionName, path.node)) {
      this.tailCalls.push(path)
    }
  },

  ReturnStatement (path) {
    if (path.node.argument && isExpressionWithTco(this.functionName, path.node.argument)) {
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
