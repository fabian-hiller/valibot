import type {
  ObjectOutput,
  ObjectSchema,
  ObjectSchemaAsync,
} from '../../schemas/index.ts';
import { objectAsync } from '../../schemas/index.ts';
import { getDefaultArgs } from '../../utils/index.ts';

import type { FString, PipeAsync } from '../../types.ts';
import type { MergeSchemaObjects } from './types.ts';

/**
 * Object schemas type.
 */
type ObjectSchemas = [
  ObjectSchema<any> | ObjectSchemaAsync<any>,
  ObjectSchema<any> | ObjectSchemaAsync<any>,
  ...(ObjectSchema<any> | ObjectSchemaAsync<any>)[]
];

/**
 * Merges multiple async object schemas into a single one. Subsequent object
 * schemas overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function mergeAsync<TObjectSchemas extends ObjectSchemas>(
  schemas: TObjectSchemas,
  pipe?: PipeAsync<ObjectOutput<MergeSchemaObjects<TObjectSchemas>>>
): ObjectSchemaAsync<MergeSchemaObjects<TObjectSchemas>>;

/**
 * Merges multiple async object schemas into a single one. Subsequent object
 * schemas overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function mergeAsync<TObjectSchemas extends ObjectSchemas>(
  schemas: TObjectSchemas,
  error?: FString,
  pipe?: PipeAsync<ObjectOutput<MergeSchemaObjects<TObjectSchemas>>>
): ObjectSchemaAsync<MergeSchemaObjects<TObjectSchemas>>;

export function mergeAsync<TObjectSchemas extends ObjectSchemas>(
  schemas: TObjectSchemas,
  arg2?: PipeAsync<ObjectOutput<MergeSchemaObjects<TObjectSchemas>>> | FString,
  arg3?: PipeAsync<ObjectOutput<MergeSchemaObjects<TObjectSchemas>>>
): ObjectSchemaAsync<MergeSchemaObjects<TObjectSchemas>> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create and return async object schema
  return objectAsync(
    schemas.reduce(
      (object, schemas) => ({ ...object, ...schemas.object }),
      {}
    ) as MergeSchemaObjects<TObjectSchemas>,
    error,
    pipe
  );
}
