import { getDefaultArgs } from '../../../../utils/index.ts';

import type {
  BaseSchema,
  BaseSchemaAsync,
  FString,
  Pipe,
  PipeAsync,
} from '../../../../types.ts';
/**
 * Returns rest, error and pipe from dynamic arguments.
 *
 * @param arg1 First argument.
 * @param arg2 Second argument.
 * @param arg3 Third argument.
 *
 * @returns The tuple arguments.
 */
export function getTupleArgs<
  TRest extends BaseSchema | BaseSchemaAsync | undefined,
  TPipe extends Pipe<any> | PipeAsync<any>
>(
  arg1: TPipe | FString | TRest | undefined,
  arg2: TPipe | FString | undefined,
  arg3: TPipe | undefined
): [TRest, FString | undefined, TPipe | undefined] {
  if (typeof arg1 === 'object' && !Array.isArray(arg1)) {
    const [error, pipe] = getDefaultArgs(arg2, arg3);
    return [arg1, error, pipe];
  }
  const [error, pipe] = getDefaultArgs<TPipe>(
    arg1 as TPipe | string | undefined,
    arg2 as TPipe | undefined
  );
  return [undefined as TRest, error, pipe];
}
