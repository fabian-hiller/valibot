import {
  object,
  type ObjectOutput,
  type ObjectSchema,
} from '../../schemas/index.ts';
import type { BaseSchema, ErrorMessage, Pipe } from '../../types.ts';
import { getRestAndDefaultArgs } from '../../utils/index.ts';
import type { MergeSchemaObjects } from './types.ts';

/**
 * Object schemas type.
 */
type ObjectSchemas = [
  ObjectSchema<any, any>,
  ObjectSchema<any, any>,
  ...ObjectSchema<any, any>[]
];

/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function merge<TObjectSchemas extends ObjectSchemas>(
  schemas: TObjectSchemas,
  pipe?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>, undefined>>
): ObjectSchema<MergeSchemaObjects<TObjectSchemas>>;

export function merge<TObjectSchemas extends ObjectSchemas>(
  schemas: TObjectSchemas,
  error?: ErrorMessage,
  pipe?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>>>
): ObjectSchema<MergeSchemaObjects<TObjectSchemas>>;

/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param arg2 A validation and transformation pipe, or an error message.
 * @param arg3 A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function merge<TObjectSchemas extends ObjectSchemas>(
  schemas: TObjectSchemas,
  error?: ErrorMessage,
  pipe?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>, undefined>>
): ObjectSchema<MergeSchemaObjects<TObjectSchemas>>;

/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function merge<
  TObjectSchemas extends ObjectSchemas,
  TObjectRest extends BaseSchema | undefined
>(
  schemas: TObjectSchemas,
  rest: TObjectRest,
  pipe?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>, TObjectRest>>
): ObjectSchema<MergeSchemaObjects<TObjectSchemas>, TObjectRest>;

/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function merge<
  TObjectSchemas extends ObjectSchemas,
  TObjectRest extends BaseSchema | undefined
>(
  schemas: TObjectSchemas,
  rest: TObjectRest,
  error?: ErrorMessage,
  pipe?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>, TObjectRest>>
): ObjectSchema<MergeSchemaObjects<TObjectSchemas>, TObjectRest>;

export function merge<
  TObjectSchemas extends ObjectSchemas,
  TObjectRest extends BaseSchema | undefined = undefined
>(
  schemas: TObjectSchemas,
  arg2?:
    | Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>, TObjectRest>>
    | ErrorMessage
    | TObjectRest,
  arg3?:
    | Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>, TObjectRest>>
    | ErrorMessage,
  arg4?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>, TObjectRest>>
): ObjectSchema<MergeSchemaObjects<TObjectSchemas>, TObjectRest> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getRestAndDefaultArgs<
    TObjectRest,
    Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>, TObjectRest>>
  >(arg2, arg3, arg4);

  // Create and return object schema
  return object(
    schemas.reduce(
      (entries, schema) => ({ ...entries, ...schema.object.entries }),
      {}
    ) as MergeSchemaObjects<TObjectSchemas>,
    rest,
    error,
    pipe
  );
}
