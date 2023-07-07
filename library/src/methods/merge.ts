import {
  object,
  type ObjectOutput,
  type ObjectSchema,
  type ObjectSchemaAsync,
} from '../schemas';
import type { Pipe } from '../types';
import { getErrorAndPipe } from '../utils';

/**
 * Object schemas type.
 */
type ObjectSchemas = [
  ObjectSchema<any>,
  ObjectSchema<any>,
  ...ObjectSchema<any>[]
];

/**
 * Merges schema objects types.
 */
export type MergeSchemaObjects<
  TObjectSchemas extends (ObjectSchema<any> | ObjectSchemaAsync<any>)[]
> = TObjectSchemas extends [infer TFirstObjectSchema]
  ? TFirstObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>
    ? TFirstObjectSchema['object']
    : never
  : TObjectSchemas extends [
      infer TFirstObjectSchema,
      ...infer TRestObjectSchemas
    ]
  ? TFirstObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>
    ? TRestObjectSchemas extends (ObjectSchema<any> | ObjectSchemaAsync<any>)[]
      ? {
          [TKey in Exclude<
            keyof TFirstObjectSchema['object'],
            keyof MergeSchemaObjects<TRestObjectSchemas>
          >]: TFirstObjectSchema['object'][TKey];
        } & MergeSchemaObjects<TRestObjectSchemas>
      : never
    : never
  : never;

/**
 * Merges multiple object schemas into a single one. Subsequent object schemas
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function merge<TObjectSchemas extends ObjectSchemas>(
  schemas: TObjectSchemas,
  pipe?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>>>
): ObjectSchema<MergeSchemaObjects<TObjectSchemas>>;

/**
 * Merges multiple object schemas into a single one. Subsequent object schemas
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function merge<TObjectSchemas extends ObjectSchemas>(
  schemas: TObjectSchemas,
  error?: string,
  pipe?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>>>
): ObjectSchema<MergeSchemaObjects<TObjectSchemas>>;

export function merge<TObjectSchemas extends ObjectSchemas>(
  schemas: TObjectSchemas,
  arg2?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>>> | string,
  arg3?: Pipe<ObjectOutput<MergeSchemaObjects<TObjectSchemas>>>
): ObjectSchema<MergeSchemaObjects<TObjectSchemas>> {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg2, arg3);

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
