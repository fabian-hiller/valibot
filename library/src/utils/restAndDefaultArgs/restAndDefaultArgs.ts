import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Pipe,
  PipeAsync,
  SchemaMetadata,
} from '../../types/index.ts';
import { defaultArgs } from '../defaultArgs/index.ts';

/**
 * Returns rest, error and pipe from dynamic arguments.
 *
 * @param arg1 First argument.
 * @param arg2 Second argument.
 * @param arg3 Third argument.
 *
 * @returns The tuple arguments.
 */
export function restAndDefaultArgs<
  TRest extends BaseSchema | BaseSchemaAsync | undefined,
  TPipe extends Pipe<any> | PipeAsync<any>
>(
  arg1: TPipe | ErrorMessageOrMetadata | TRest | undefined,
  arg2: TPipe | ErrorMessageOrMetadata | undefined,
  arg3: TPipe | undefined
): [
  TRest,
  ErrorMessage | undefined,
  TPipe | undefined,
  SchemaMetadata | undefined
] {
  if (!arg1 || isSchema(arg1)) {
    const [error, pipe, metadata] = defaultArgs(arg2, arg3);
    return [arg1 as TRest, error, pipe, metadata];
  }
  const [error, pipe, metadata] = defaultArgs<TPipe>(
    arg1 as TPipe | ErrorMessage | undefined,
    arg2 as TPipe | undefined
  );
  return [undefined as TRest, error, pipe, metadata];
}

/**
 * Determine if the target is a standardized schema
 *
 * @param target The target to be determined.
 *
 * @returns result
 */
function isSchema(target: any): target is BaseSchema | BaseSchemaAsync {
  if (target == null) return false;
  if (typeof target !== 'object') return false;
  if (Array.isArray(target)) return false;
  return (
    typeof target._parse === 'function' && typeof target.async === 'boolean'
  );
}
