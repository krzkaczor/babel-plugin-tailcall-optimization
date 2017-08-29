module.exports = t => ({
  ReturnStatement (path) {
    if (path.node.argument && path.node.argument.type === 'ConditionalExpression') {
      const { test, consequent, alternate } = path.node.argument

      path.replaceWith(
        t.ifStatement(
          test,
          t.blockStatement([t.returnStatement(consequent)]),
          t.blockStatement([t.returnStatement(alternate)])
        )
      )
    }
  }
})
