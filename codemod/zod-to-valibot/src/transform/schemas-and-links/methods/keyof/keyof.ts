import j from 'jscodeshift';

export function transformKeyof(
  valibotIdentifier: string,
  schemaExp: j.CallExpression | j.Identifier,
  args: j.CallExpression['arguments']
) {
  return j.callExpression(
    j.memberExpression(j.identifier(valibotIdentifier), j.identifier('keyof')),
    [schemaExp, ...args]
  );
}
