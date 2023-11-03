import {
  objectAsync,
  type ObjectOutput,
  type ObjectSchema,
  type ObjectSchemaAsync,
} from '../../schemas/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  PipeAsync,
} from '../../types.ts';
import { getRestAndDefaultArgs } from '../../utils/index.ts';
import type { MergeObjects } from './types.ts';

/**
 * Object schemas type.
 */
type ObjectSchemas = [
  ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  ...(ObjectSchema<any, any> | ObjectSchemaAsync<any, any>)[]
];

/**
 * Merges the entries of multiple async object schemas. Subsequent object
 * entries overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function mergeAsync<TSchemas extends ObjectSchemas>(
  schemas: TSchemas,
  pipe?: PipeAsync<ObjectOutput<MergeObjects<TSchemas>, undefined>>
): ObjectSchemaAsync<MergeObjects<TSchemas>>;

/**
 * Merges the entries of multiple async object schemas. Subsequent object
 * entries overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function mergeAsync<TSchemas extends ObjectSchemas>(
  schemas: TSchemas,
  error?: ErrorMessage,
  pipe?: PipeAsync<ObjectOutput<MergeObjects<TSchemas>, undefined>>
): ObjectSchemaAsync<MergeObjects<TSchemas>>;

/**
 * Merges the entries of multiple async object schemas. Subsequent object
 * entries overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function mergeAsync<
  TSchemas extends ObjectSchemas,
  TRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  schemas: TSchemas,
  rest: TRest,
  pipe?: PipeAsync<ObjectOutput<MergeObjects<TSchemas>, TRest>>
): ObjectSchemaAsync<MergeObjects<TSchemas>, TRest>;

/**
 * Merges the entries of multiple async object schemas. Subsequent object
 * entries overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function mergeAsync<
  TSchemas extends ObjectSchemas,
  TRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  schemas: TSchemas,
  rest: TRest,
  error?: ErrorMessage,
  pipe?: PipeAsync<ObjectOutput<MergeObjects<TSchemas>, TRest>>
): ObjectSchemaAsync<MergeObjects<TSchemas>, TRest>;

export function mergeAsync<
  TSchemas extends ObjectSchemas,
  TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  schemas: TSchemas,
  arg2?:
    | PipeAsync<ObjectOutput<MergeObjects<TSchemas>, TRest>>
    | ErrorMessage
    | TRest,
  arg3?: PipeAsync<ObjectOutput<MergeObjects<TSchemas>, TRest>> | ErrorMessage,
  arg4?: PipeAsync<ObjectOutput<MergeObjects<TSchemas>, TRest>>
): ObjectSchemaAsync<MergeObjects<TSchemas>, TRest> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getRestAndDefaultArgs<
    TRest,
    PipeAsync<ObjectOutput<MergeObjects<TSchemas>, TRest>>
  >(arg2, arg3, arg4);

  // Create and return async object schema
  return objectAsync(
    schemas.reduce(
      (entries, schema) => ({ ...entries, ...schema.entries }),
      {}
    ) as MergeObjects<TSchemas>,
    rest,
    error,
    pipe
  );
}
