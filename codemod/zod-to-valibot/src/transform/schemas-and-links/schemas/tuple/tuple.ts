import j from 'jscodeshift';
import { ElementFrom } from '../../../../utils';
import {
  getSchemaComps,
  getSchemaWithOptionalDescription,
} from '../../schemas/helpers';

export function transformTuple(
  valibotIdentifier: string,
  args: j.CallExpression['arguments'],
  restArg: ElementFrom<j.CallExpression['arguments']> | null
) {
  const { baseSchema, description } = getSchemaComps(
    valibotIdentifier,
    restArg ? 'tupleWithRest' : 'tuple',
    restArg ? [...args, restArg] : args,
    0
  );
  return getSchemaWithOptionalDescription(
    valibotIdentifier,
    baseSchema,
    description
  );
}
