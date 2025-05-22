import j from 'jscodeshift';

export function transformShape(schema: j.CallExpression | j.Identifier) {
  return j.memberExpression(schema, j.identifier('entries'));
}
