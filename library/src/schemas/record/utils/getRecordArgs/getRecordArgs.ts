import type {
  BaseSchema,
  BaseSchemaAsync,
  Pipe,
  PipeAsync,
} from '../../../../types.ts';
import { getDefaultArgs } from '../../../../utils/index.ts';
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
export function getRecordArgs<
  TRecordKey extends RecordKey | RecordKeyAsync,
  TRecordValue extends BaseSchema | BaseSchemaAsync,
  TPipe extends Pipe<any> | PipeAsync<any>
>(
  arg1: TRecordValue | TRecordKey,
  arg2: TPipe | string | TRecordValue | undefined,
  arg3: TPipe | string | undefined,
  arg4: TPipe | undefined
): [TRecordKey, TRecordValue, string | undefined, TPipe | undefined] {
  if (typeof arg2 === 'object' && !Array.isArray(arg2)) {
    const [error, pipe] = getDefaultArgs(arg3, arg4);
    return [arg1 as TRecordKey, arg2, error, pipe];
  }
  const [error, pipe] = getDefaultArgs<TPipe>(
    arg2 as TPipe | string | undefined,
    arg3 as TPipe | undefined
  );
  return [string() as TRecordKey, arg1 as TRecordValue, error, pipe];
}
