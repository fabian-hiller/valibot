import type { FString, Pipe, PipeAsync } from '../../types.ts';

/**
 * Returns error and pipe from dynamic arguments.
 *
 * @param arg1 First argument.
 * @param arg2 Second argument.
 *
 * @returns The default arguments.
 */
export function getDefaultArgs<TPipe extends Pipe<any> | PipeAsync<any>>(
  arg1: FString | TPipe | undefined,
  arg2: TPipe | undefined
): [FString | undefined, TPipe | undefined] {
  return Array.isArray(arg1) ? [undefined, arg1] : [arg1, arg2];
}
