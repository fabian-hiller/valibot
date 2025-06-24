import j from 'jscodeshift';
import { addToPipe } from '../../helpers';

export function transformStrict(
  valibotIdentifier: string,
  schemaExp: j.CallExpression | j.MemberExpression | j.Identifier
) {
  if (
    schemaExp.type === 'CallExpression' &&
    schemaExp.callee.type === 'MemberExpression' &&
    schemaExp.callee.object.type === 'Identifier' &&
    schemaExp.callee.object.name === valibotIdentifier &&
    schemaExp.callee.property.type === 'Identifier' &&
    schemaExp.callee.property.name === 'object'
  ) {
    return j.callExpression(
      j.memberExpression(
        j.identifier(valibotIdentifier),
        j.identifier('strictObject')
      ),
      schemaExp.arguments
    );
  }
  return addToPipe(
    valibotIdentifier,
    schemaExp,
    j.callExpression(
      j.memberExpression(
        j.identifier(valibotIdentifier),
        j.identifier('strict')
      ),
      []
    )
  );
}
