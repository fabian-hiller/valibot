import j from 'jscodeshift';

export function transformStrict(
  valibotIdentifier: string,
  schemaExp: j.CallExpression | j.Identifier
) {
  return j.callExpression(
    j.memberExpression(
      j.identifier(valibotIdentifier),
      j.identifier('strictObject')
    ),
    j.CallExpression.check(schemaExp)
      ? schemaExp.arguments
      : [j.memberExpression(schemaExp, j.identifier('entries'))]
  );
}
