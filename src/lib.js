export default function ({ types: t }) {
  function findTailCalls (fnPath, fnName) {
    const inFunctionTraversal = {
      ReturnStatement (path) {
        if (path.node.argument.type === 'CallExpression' && path.node.argument.callee.name === this.functionName) {
          this.tc = path
        }
      },

      FunctionDeclaration (path) {
        this.needsClosure = true
      },

      ArrowFunctionExpression (path) {
        this.needsClosure = true
      },

      FunctionExpression (path) {
        this.needsClosure = true
      }
    }

    const traverseContext = { tc: null, functionName: fnName }
    fnPath.traverse(inFunctionTraversal, traverseContext)

    return { tailCalls: traverseContext.tc, needsClosure: traverseContext.needsClosure }
  }

  function optimizeTailCalls (functionPath, tailCall, needsClosure) {
    const repeatId = functionPath.scope.generateUidIdentifier('repeat')
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

    const inputVariables = functionPath.node.params.map(paramOrExpression => paramOrExpression.left || paramOrExpression)

    // we need a tmp variables while rewriting tail calls
    const tmpInputVariables = inputVariables.map(v => functionPath.scope.generateUidIdentifier(v.name))
    const tmpInputVariablesDeclaration = t.variableDeclaration('var', tmpInputVariables.map(v => t.variableDeclarator(v)))

    // first we assign to tmp variable...
    const assignmentsToTmpInputs = tmpInputVariables.map((tmpInputVar, index) => t.assignmentExpression('=', tmpInputVar, tailCall.node.argument.arguments[ index ]))
    // and then we do a swap
    const swapTmpInputWithInput = inputVariables.map((inputVar, index) => t.assignmentExpression('=', inputVar, tmpInputVariables[ index ]))

    tailCall.replaceWithMultiple([
      ...assignmentsToTmpInputs,
      ...swapTmpInputWithInput,
      setRepeatToTrue,
      t.continueStatement()
    ])

    const body = functionPath.get('body')

    functionPath.get('body').unshiftContainer('body', setRepeatToFalse)

    let loopBody = body.node

    body.replaceWith(
      t.blockStatement([
        repeatDeclaration,
        tmpInputVariablesDeclaration,
        t.whileStatement(repeatId, loopBody)
      ])
    )
  }

  const functions = {
    FunctionDeclaration (path) {
      const { tailCalls, needsClosure } = findTailCalls(path, path.node.id.name)

      if (tailCalls) {
        optimizeTailCalls(path, tailCalls, needsClosure)
      }
    },

    VariableDeclarator (path) {
      if ((path.get('init').isArrowFunctionExpression() || path.get('init').isFunctionExpression()) && path.get('id').isIdentifier()) {
        const functionName = path.get('id').node.name
        const functionBody = path.get('init')

        const { tailCalls, needsClosure } = findTailCalls(functionBody, functionName)

        if (tailCalls && !needsClosure) { // @todo for now when closure is detected skip TCO - we should implement it also in that case
          optimizeTailCalls(functionBody, tailCalls, needsClosure)
        }
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
