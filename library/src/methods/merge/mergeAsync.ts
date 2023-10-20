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
import type { MergeSchemaObjects } from './types.ts';

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
export function mergeAsync<TObjectSchemas extends ObjectSchemas>(
  schemas: TObjectSchemas,
  pipe?: PipeAsync<ObjectOutput<MergeSchemaObjects<TObjectSchemas>, undefined>>
): ObjectSchemaAsync<MergeSchemaObjects<TObjectSchemas>>;

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
export function mergeAsync<TObjectSchemas extends ObjectSchemas>(
  schemas: TObjectSchemas,
  error?: ErrorMessage,
  pipe?: PipeAsync<ObjectOutput<MergeSchemaObjects<TObjectSchemas>, undefined>>
): ObjectSchemaAsync<MergeSchemaObjects<TObjectSchemas>>;

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
  TObjectSchemas extends ObjectSchemas,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  schemas: TObjectSchemas,
  rest: TObjectRest,
  pipe?: PipeAsync<
    ObjectOutput<MergeSchemaObjects<TObjectSchemas>, TObjectRest>
  >
): ObjectSchemaAsync<MergeSchemaObjects<TObjectSchemas>, TObjectRest>;

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
  TObjectSchemas extends ObjectSchemas,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  schemas: TObjectSchemas,
  rest: TObjectRest,
  error?: ErrorMessage,
  pipe?: PipeAsync<
    ObjectOutput<MergeSchemaObjects<TObjectSchemas>, TObjectRest>
  >
): ObjectSchemaAsync<MergeSchemaObjects<TObjectSchemas>, TObjectRest>;

export function mergeAsync<
  TObjectSchemas extends ObjectSchemas,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  schemas: TObjectSchemas,
  arg2?:
    | PipeAsync<ObjectOutput<MergeSchemaObjects<TObjectSchemas>, TObjectRest>>
    | ErrorMessage
    | TObjectRest,
  arg3?:
    | PipeAsync<ObjectOutput<MergeSchemaObjects<TObjectSchemas>, TObjectRest>>
    | ErrorMessage,
  arg4?: PipeAsync<
    ObjectOutput<MergeSchemaObjects<TObjectSchemas>, TObjectRest>
  >
): ObjectSchemaAsync<MergeSchemaObjects<TObjectSchemas>, TObjectRest> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getRestAndDefaultArgs<
    TObjectRest,
    PipeAsync<ObjectOutput<MergeSchemaObjects<TObjectSchemas>, TObjectRest>>
  >(arg2, arg3, arg4);

  // Create and return async object schema
  return objectAsync(
    schemas.reduce(
      (entries, schema) => ({ ...entries, ...schema.object.entries }),
      {}
    ) as MergeSchemaObjects<TObjectSchemas>,
    rest,
    error,
    pipe
  );
}
