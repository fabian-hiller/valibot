import j from 'jscodeshift';
import { getSchemaComps, getSchemaWithOptionalDescription } from '../helpers';

export function transformObject(
  valibotIdentifier: string,
  args: j.CallExpression['arguments']
) {
  const { baseSchema, description } = getSchemaComps(
    valibotIdentifier,
    'object',
    args,
    2
  );
  return getSchemaWithOptionalDescription(
    valibotIdentifier,
    baseSchema,
    description
  );
}
