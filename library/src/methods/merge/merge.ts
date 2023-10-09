import {
  object,
  type ObjectOutput,
  type ObjectSchema,
} from '../../schemas/index.ts';
import type { ErrorMessage, Pipe } from '../../types.ts';
import { getDefaultArgs } from '../../utils/index.ts';
import type { MergeSchemaObjects } from './types.ts';

/**
 * Object schemas type.
 */
type ObjectSchemas = [
  ObjectSchema<any>,
  ObjectSchema<any>,
  ...ObjectSchema<any>[]
];

export function merge<TObjectSchemas extends ObjectSchemas>(
  schemas: TObjectSchemas,
  pipe?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>>>
): ObjectSchema<MergeSchemaObjects<TObjectSchemas>>;

export function merge<TObjectSchemas extends ObjectSchemas>(
  schemas: TObjectSchemas,
  error?: ErrorMessage,
  pipe?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>>>
): ObjectSchema<MergeSchemaObjects<TObjectSchemas>>;

/**
 * Merges multiple object schemas into a single one. Subsequent object schemas
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
  arg2?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>>> | ErrorMessage,
  arg3?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>>>
): ObjectSchema<MergeSchemaObjects<TObjectSchemas>> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create and return object schema
  return object(
    schemas.reduce(
      (object, schemas) => ({ ...object, ...schemas.object }),
      {}
    ) as MergeSchemaObjects<TObjectSchemas>,
    error,
    pipe
  );
}
