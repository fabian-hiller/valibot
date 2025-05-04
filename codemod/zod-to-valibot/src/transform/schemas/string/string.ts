import j from 'jscodeshift';

export function transformString(valibotIdentifier: string, coerce: boolean) {
  if (coerce) {
    return j.callExpression(
      j.memberExpression(j.identifier(valibotIdentifier), j.identifier('pipe')),
      [
        j.callExpression(
          j.memberExpression(
            j.identifier(valibotIdentifier),
            j.identifier('unknown')
          ),
          []
        ),
        j.callExpression(
          j.memberExpression(
            j.identifier(valibotIdentifier),
            j.identifier('transform')
          ),
          [j.identifier('String')]
        ),
      ]
    );
  }
  return j.callExpression(
    j.memberExpression(j.identifier(valibotIdentifier), j.identifier('string')),
    []
  );
}
