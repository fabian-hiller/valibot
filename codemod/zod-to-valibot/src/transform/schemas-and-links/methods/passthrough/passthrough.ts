import j from 'jscodeshift';

export function transformPassthrough(
  valibotIdentifier: string,
  schemaExp: j.CallExpression | j.MemberExpression | j.Identifier
  // args: j.CallExpression['arguments']
) {
  return j.callExpression(
    j.memberExpression(
      j.identifier(valibotIdentifier),
      j.identifier('looseObject')
    ),
    j.CallExpression.check(schemaExp)
      ? schemaExp.arguments
      : [j.memberExpression(schemaExp, j.identifier('entries'))]
  );
}
