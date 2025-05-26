import j from 'jscodeshift';
import {
  getSchemaComps,
  getSchemaWithOptionalDescription,
} from '../../schemas/helpers';

export function transformRecord(
  valibotIdentifier: string,
  args: j.CallExpression['arguments']
) {
  const { baseSchema, description } = getSchemaComps(
    valibotIdentifier,
    'record',
    args.length === 1
      ? [
          j.callExpression(
            j.memberExpression(
              j.identifier(valibotIdentifier),
              j.identifier('string')
            ),
            []
          ),
          ...args,
        ]
      : args,
    0
  );
  return getSchemaWithOptionalDescription(
    valibotIdentifier,
    baseSchema,
    description
  );
}
