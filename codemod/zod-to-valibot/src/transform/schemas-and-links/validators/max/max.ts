import j from 'jscodeshift';
import { splitLastArg } from '../../helpers';
import { getValidatorMsg } from '../helpers';

export function transformMax(
  valibotIdentifier: string,
  args: j.CallExpression['arguments'],
  isValueTypeSchema: boolean
) {
  const { firstArgs: argsExceptOptions, lastArg } = splitLastArg(2, args);
  const msgArg = getValidatorMsg(lastArg);

  return j.callExpression(
    j.memberExpression(
      j.identifier(valibotIdentifier),
      j.identifier(`max${isValueTypeSchema ? 'Value' : 'Length'}`)
    ),
    [...argsExceptOptions, ...(msgArg !== null ? [msgArg] : [])]
  );
}
