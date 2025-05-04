import j from 'jscodeshift';

export function transformNumber(valibotIdentifier: string, coerce: boolean) {
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
          [j.identifier('Number')]
        ),
        j.callExpression(
          j.memberExpression(
            j.identifier(valibotIdentifier),
            j.identifier('number')
          ),
          []
        ),
      ]
    );
  }
  return j.callExpression(
    j.memberExpression(j.identifier(valibotIdentifier), j.identifier('number')),
    []
  );
}
