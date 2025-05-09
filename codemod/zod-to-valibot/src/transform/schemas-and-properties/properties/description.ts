import j from 'jscodeshift';

export function transformDescription(
  valibotIdentifier: string,
  schema: j.CallExpression | j.Identifier
) {
  return j.callExpression(
    j.memberExpression(
      j.identifier(valibotIdentifier),
      j.identifier('getDescription')
    ),
    [schema]
  );
}
