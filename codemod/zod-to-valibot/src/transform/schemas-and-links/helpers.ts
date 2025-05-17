import j from 'jscodeshift';

export function splitLastArg(
  maxArgs: number,
  args: j.CallExpression['arguments']
): {
  firstArgs: j.CallExpression['arguments'];
  lastArg: j.CallExpression['arguments'][number] | null;
} {
  let firstArgs = args;
  let lastArg: j.CallExpression['arguments'][number] | null = null;
  if (args.length === maxArgs && maxArgs > 0) {
    firstArgs = args.slice(0, args.length - 1);
    lastArg = args[args.length - 1];
  }
  return { firstArgs, lastArg };
}
