import j from 'jscodeshift';

export function transformStrip(
  valibotIdentifier: string,
  schemaExp: j.CallExpression | j.Identifier
) {
  return j.callExpression(
    j.memberExpression(j.identifier(valibotIdentifier), j.identifier('object')),
    j.CallExpression.check(schemaExp)
      ? schemaExp.arguments
      : [j.memberExpression(schemaExp, j.identifier('entries'))]
  );
}
