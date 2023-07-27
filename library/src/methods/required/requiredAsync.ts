import {
  nonOptionalAsync,
  type NonOptionalSchemaAsync,
  objectAsync,
  type ObjectOutput,
  type ObjectSchema,
  type ObjectSchemaAsync,
  type ObjectShapesAsync,
} from '../../schemas/index.ts';
import type { BaseSchema, Pipe } from '../../types.ts';
import { getErrorAndPipe } from '../../utils/index.ts';

/**
 * Required object schema type.
 */
type Required<TObjectSchema extends ObjectShapesAsync> = {
  [TKey in keyof TObjectSchema]: NonOptionalSchemaAsync<TObjectSchema[TKey]>;
};

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to none optional.
 *
 * @param schema The affected scheme.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function requiredAsync<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>
>(
  schema: TObjectSchema,
  pipe?: Pipe<ObjectOutput<Required<TObjectSchema['object']>>>
): ObjectSchemaAsync<Required<TObjectSchema['object']>>;

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to none optional.
 *
 * @param schema The affected scheme.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function requiredAsync<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>
>(
  schema: TObjectSchema,
  error?: string,
  pipe?: Pipe<ObjectOutput<Required<TObjectSchema['object']>>>
): ObjectSchemaAsync<Required<TObjectSchema['object']>>;

export function requiredAsync<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>
>(
  schema: TObjectSchema,
  arg3?: Pipe<ObjectOutput<Required<TObjectSchema['object']>>> | string,
  arg4?: Pipe<ObjectOutput<Required<TObjectSchema['object']>>>
): ObjectSchemaAsync<Required<TObjectSchema['object']>> {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg3, arg4);

  // Create and return object schema
  return objectAsync(
    Object.entries(schema.object).reduce(
      (object, [key, schema]) => ({
        ...object,
        [key]: nonOptionalAsync(schema as BaseSchema),
      }),
      {}
    ) as Required<TObjectSchema['object']>,
    error,
    pipe
  );
}
