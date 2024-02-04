import {
  object,
  type ObjectOutput,
  type ObjectSchema,
} from '../../schemas/index.ts';
import type {
  BaseSchema,
  ErrorMessageOrMetadata,
  Pipe,
} from '../../types/index.ts';
import { restAndDefaultArgs } from '../../utils/index.ts';
import type { MergeObjects } from './types.ts';

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
export function merge<TSchemas extends ObjectSchemas>(
  schemas: TSchemas,
  pipe?: Pipe<ObjectOutput<MergeObjects<TSchemas>, undefined>>
): ObjectSchema<MergeObjects<TSchemas>>;

/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function merge<TSchemas extends ObjectSchemas>(
  schemas: TSchemas,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<ObjectOutput<MergeObjects<TSchemas>, undefined>>
): ObjectSchema<MergeObjects<TSchemas>>;

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
  TSchemas extends ObjectSchemas,
  TRest extends BaseSchema | undefined
>(
  schemas: TSchemas,
  rest: TRest,
  pipe?: Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>>
): ObjectSchema<MergeObjects<TSchemas>, TRest>;

/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param rest The object rest.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function merge<
  TSchemas extends ObjectSchemas,
  TRest extends BaseSchema | undefined
>(
  schemas: TSchemas,
  rest: TRest,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>>
): ObjectSchema<MergeObjects<TSchemas>, TRest>;

export function merge<
  TSchemas extends ObjectSchemas,
  TRest extends BaseSchema | undefined = undefined
>(
  schemas: TSchemas,
  arg2?:
    | Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>>
    | ErrorMessageOrMetadata
    | TRest,
  arg3?:
    | Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>>
    | ErrorMessageOrMetadata,
  arg4?: Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>>
): ObjectSchema<MergeObjects<TSchemas>, TRest> {
  // Get rest, message and pipe argument
  const [rest, message, pipe, metadata] = restAndDefaultArgs<
    TRest,
    Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>>
  >(arg2, arg3, arg4);

  // Create and return object schema
  return object(
    schemas.reduce(
      (entries, schema) => ({ ...entries, ...schema.entries }),
      {}
    ) as MergeObjects<TSchemas>,
    rest,
    metadata === undefined ? message : { message, ...metadata },
    pipe
  );
}
