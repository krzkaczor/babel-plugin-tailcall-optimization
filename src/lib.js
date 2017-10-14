const findTailCalls = require('./findTailCalls')

export default function ({ types: t }) {
  function optimizeTailCalls (functionName, functionPath, tailCalls) {
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

    function replaceTailcall (tailCalls) {
      tailCalls.forEach(tailCall => {
        if (tailCall.node.argument.type === 'ConditionalExpression') {
          const { test, consequent, alternate } = tailCall.node.argument

          tailCall.replaceWith(
            t.ifStatement(
              test,
              t.blockStatement([t.returnStatement(consequent)]),
              t.blockStatement([t.returnStatement(alternate)])
            )
          )

          const { tailCalls: tailCallsFromTernary } = findTailCalls(tailCall, functionName)
          replaceTailcall(tailCallsFromTernary)
        } else {
          // first we assign to tmp variable...
          const assignmentsToTmpInputs = tmpInputVariables.map((tmpInputVar, index) =>
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                tmpInputVar,
                tailCall.node.argument.arguments[ index ]
              )
            )
          )
          // and then we do a swap
          const swapTmpInputWithInput = inputVariables.map((inputVar, index) => t.expressionStatement(t.assignmentExpression('=', inputVar, tmpInputVariables[ index ])))

          tailCall.replaceWithMultiple([
            ...assignmentsToTmpInputs,
            ...swapTmpInputWithInput,
            setRepeatToTrue,
            t.continueStatement()
          ])
        }
      })
    }

    replaceTailcall(tailCalls)

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
      if (path.node.id) {
        const {tailCalls, needsClosure} = findTailCalls(path, path.node.id.name)

        if (tailCalls.length > 0 && !needsClosure) {
          optimizeTailCalls(path.node.id.name, path, tailCalls, needsClosure)
        }
      }
    },

    VariableDeclarator (path) {
      if ((path.get('init').isArrowFunctionExpression() || path.get('init').isFunctionExpression()) && path.get('id').isIdentifier()) {
        const functionName = path.get('id').node.name
        const functionBody = path.get('init')

        const { tailCalls, needsClosure } = findTailCalls(functionBody, functionName)

        if (tailCalls.length > 0 && !needsClosure) { // @todo for now when closure is detected skip TCO - we should implement it also in that case
          optimizeTailCalls(functionName, functionBody, tailCalls, needsClosure)
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
