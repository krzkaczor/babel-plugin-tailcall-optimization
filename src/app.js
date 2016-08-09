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
        traverseContext.tc.replaceWithMultiple([
          t.assignmentExpression('=', path.node.params[0], traverseContext.tc.node.argument.arguments[0]), // loop over all parameters here
          t.continueStatement()
        ])

        path.node._paths[2].replaceWith(
          t.blockStatement([
            t.whileStatement(t.numericLiteral(1), path.node._paths[2].node)
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
