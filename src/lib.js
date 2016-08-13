export default function ({ types: t }) {
  const inFunctionTraversal = {
    ReturnStatement (path) {
      if (path.node.argument.type === 'CallExpression' && path.node.argument.callee.name === this.containingFunctionNode.id.name) {
        this.hasTailRecursiveCall = true
        this.tc = path
      }
    }
  }

  const functions = {
    FunctionDeclaration (path) {
      const traverseContext = { hasTailRecursiveCall: false, tc: null, containingFunctionNode: path.node }
      path.traverse(inFunctionTraversal, traverseContext)

      if (traverseContext.hasTailRecursiveCall) {
        const repeatId = path.scope.generateUidIdentifier('repeat')
        const repeatDeclaration = t.variableDeclaration('var', [
          t.variableDeclarator(repeatId, t.booleanLiteral(true))
        ])

        const setRepeatToFalse = t.expressionStatement(
          t.assignmentExpression(
            '=',
            repeatId,
            t.booleanLiteral(false)
          )
        )
        const setRepeatToTrue = t.expressionStatement(
          t.assignmentExpression(
            '=',
            repeatId,
            t.booleanLiteral(true)
          )
        )

        const inputVariables = path.node.params.map(paramOrExpression => paramOrExpression.left || paramOrExpression)
        const assignments = inputVariables.map((paramNode, index) => t.assignmentExpression('=', paramNode, traverseContext.tc.node.argument.arguments[ index ]))

        traverseContext.tc.replaceWithMultiple([
          ...assignments,
          setRepeatToTrue,
          t.continueStatement()
        ])

        const body = path.get('body')

        path.get('body').unshiftContainer('body', setRepeatToFalse)

        body.replaceWith(
          t.blockStatement([
            repeatDeclaration,
            t.whileStatement(repeatId, body.node)
          ])
        )
      }
    }
  }

  return {
    visitor: {
      Program (path) {
        path.traverse(functions)
      }
    }
  }
}
