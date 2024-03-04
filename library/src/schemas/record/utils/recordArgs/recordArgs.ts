import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Pipe,
  PipeAsync,
} from '../../../../types/index.ts';
import { defaultArgs } from '../../../../utils/index.ts';
import { string } from '../../../string/index.ts';
import type { RecordKey } from '../../record.ts';
import type { RecordKeyAsync } from '../../recordAsync.ts';

/**
 * Returns key, value, error and pipe from dynamic arguments.
 *
 * @param arg1 First argument.
 * @param arg2 Second argument.
 * @param arg3 Third argument.
 * @param arg4 Fourth argument.
 *
 * @returns The record arguments.
 */
export function recordArgs<
  TKey extends RecordKey | RecordKeyAsync,
  TValue extends BaseSchema | BaseSchemaAsync,
  TPipe extends Pipe<any> | PipeAsync<any>,
>(
  arg1: TValue | TKey,
  arg2: TPipe | ErrorMessage | TValue | undefined,
  arg3: TPipe | ErrorMessage | undefined,
  arg4: TPipe | undefined
): [TKey, TValue, ErrorMessage | undefined, TPipe | undefined] {
  if (typeof arg2 === 'object' && !Array.isArray(arg2)) {
    const [message, pipe] = defaultArgs(arg3, arg4);
    return [arg1 as TKey, arg2, message, pipe];
  }
  const [message, pipe] = defaultArgs<TPipe>(
    arg2 as TPipe | ErrorMessage | undefined,
    arg3 as TPipe | undefined
  );
  return [string() as TKey, arg1 as TValue, message, pipe];
}
