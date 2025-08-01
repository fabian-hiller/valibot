import j from 'jscodeshift';
import { splitLastArg } from '../../helpers';
import { getValidatorMsg } from '../helpers';

export function transformIncludes(
  valibotIdentifier: string,
  args: j.CallExpression['arguments']
) {
  const { firstArgs: argsExceptOptions, lastArg } = splitLastArg(2, args);
  const msgArg = getValidatorMsg(lastArg);

  return j.callExpression(
    j.memberExpression(
      j.identifier(valibotIdentifier),
      j.identifier('includes')
    ),
    [...argsExceptOptions, ...(msgArg !== null ? [msgArg] : [])]
  );
}
