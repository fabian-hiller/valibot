import j from 'jscodeshift';

export function transformDescription(
  accessFrom: j.CallExpression | j.Identifier
) {
  return j.optionalMemberExpression(
    j.callExpression(
      j.memberExpression(
        j.callExpression(
          j.memberExpression(
            j.arrayExpression([
              j.spreadElement(
                j.memberExpression(accessFrom, j.identifier('pipe'))
              ),
            ]),
            j.identifier('reverse')
          ),
          []
        ),
        j.identifier('find')
      ),
      [
        j.arrowFunctionExpression(
          [j.identifier('action')],
          j.binaryExpression(
            '===',
            j.memberExpression(j.identifier('action'), j.identifier('type')),
            j.literal('description')
          )
        ),
      ]
    ),
    j.identifier('description')
  );
}
