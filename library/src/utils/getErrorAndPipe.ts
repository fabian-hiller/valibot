import type { Pipe } from '../types';

/**
 * Returns error and pipe from dynamic arguments.
 *
 * @param arg1 First argument.
 * @param arg2 Second argument.
 *
 * @returns The error and pipe.
 */
export function getErrorAndPipe<TPipe extends Pipe<any>>(
  arg1?: string | TPipe,
  arg2?: TPipe
): { error: string | undefined; pipe: TPipe } {
  const [error, pipe = [] as unknown as TPipe] =
    !arg1 || typeof arg1 === 'string' ? [arg1, arg2] : [undefined, arg1];
  return { error, pipe };
}
