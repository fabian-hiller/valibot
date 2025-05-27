import j from 'jscodeshift';
import {
  getSchemaComps,
  getSchemaWithOptionalDescription,
} from '../../schemas/helpers';

export function transformTuple(
  valibotIdentifier: string,
  args: j.CallExpression['arguments'],
  restArg: j.CallExpression['arguments']
) {
  // if has property "rest", the name should be "tupleWithRest"
  // it gets an additional parameter, the one inside "rest"
  const { baseSchema, description } = getSchemaComps(
    valibotIdentifier,
    'tupleWithRest',
    [...args, ...restArg],
    0
  );
  return getSchemaWithOptionalDescription(
    valibotIdentifier,
    baseSchema,
    description
  );
}
