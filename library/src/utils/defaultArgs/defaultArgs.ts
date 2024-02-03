import type {
  ErrorMessage,
  ErrorMessageOrMetadata,
  Pipe,
  PipeAsync,
  SchemaMetadata,
} from '../../types/index.ts';

/**
 * Returns message and pipe from dynamic arguments.
 *
 * @param arg1 First argument.
 * @param arg2 Second argument.
 *
 * @returns The default arguments.
 */
export function defaultArgs<TPipe extends Pipe<any> | PipeAsync<any>>(
  arg1: ErrorMessageOrMetadata | TPipe | undefined,
  arg2: TPipe | undefined
): [ErrorMessage | undefined, TPipe | undefined, SchemaMetadata | undefined] {
  if (Array.isArray(arg1)) return [undefined, arg1, undefined];

  if (typeof arg1 === 'string' || typeof arg1 === 'function')
    return [arg1, arg2, undefined];

  if (arg1 === undefined) return [undefined, arg2, undefined];
  const { message, ...metadata } = arg1;
  return [message, arg2, metadata];
}
