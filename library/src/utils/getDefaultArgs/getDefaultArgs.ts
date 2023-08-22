import type { Pipe, PipeAsync } from '../../types.ts';

/**
 * Returns error and pipe from dynamic arguments.
 *
 * @param arg1 First argument.
 * @param arg2 Second argument.
 *
 * @returns The default arguments.
 */
export function getDefaultArgs<TPipe extends Pipe<any> | PipeAsync<any>>(
  arg1: string | TPipe | undefined,
  arg2: TPipe | undefined
): [string | undefined, TPipe | undefined] {
  return !arg1 || typeof arg1 === 'string' ? [arg1, arg2] : [undefined, arg1];
}
