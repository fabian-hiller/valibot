import j from 'jscodeshift';

export function transformDate(valibotIdentifier: string, coerce: boolean) {
  if (coerce) {
    return j.callExpression(
      j.memberExpression(j.identifier(valibotIdentifier), j.identifier('pipe')),
      [
        j.callExpression(
          j.memberExpression(
            j.identifier(valibotIdentifier),
            j.identifier('any')
          ),
          []
        ),
        j.callExpression(
          j.memberExpression(
            j.identifier(valibotIdentifier),
            j.identifier('transform')
          ),
          [
            j.arrowFunctionExpression(
              [j.identifier('input')],
              j.blockStatement([
                j.tryStatement(
                  j.blockStatement([
                    j.returnStatement(
                      j.newExpression(j.identifier('Date'), [
                        j.identifier('input'),
                      ])
                    ),
                  ]),
                  j.catchClause(
                    null,
                    null,
                    j.blockStatement([j.returnStatement(j.identifier('input'))])
                  )
                ),
              ]),
              false
            ),
          ]
        ),
        j.callExpression(
          j.memberExpression(
            j.identifier(valibotIdentifier),
            j.identifier('date')
          ),
          []
        ),
      ]
    );
  }
  return j.callExpression(
    j.memberExpression(j.identifier(valibotIdentifier), j.identifier('bigint')),
    []
  );
}
