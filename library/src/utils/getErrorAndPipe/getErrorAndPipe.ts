import type { Pipe, PipeAsync } from '../../types.ts';

/**
 * Returns error and pipe from dynamic arguments.
 *
 * @param arg1 First argument.
 * @param arg2 Second argument.
 *
 * @returns The error and pipe.
 */
export function getErrorAndPipe<TPipe extends Pipe<any> | PipeAsync<any>>(
  arg1?: string | TPipe,
  arg2?: TPipe
): { error?: string; pipe?: TPipe } {
  return !arg1 || typeof arg1 === 'string'
    ? { error: arg1, pipe: arg2 }
    : { pipe: arg1 };
}
