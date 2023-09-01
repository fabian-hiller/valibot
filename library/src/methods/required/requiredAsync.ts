import { nonOptionalAsync, objectAsync } from '../../schemas/index.ts';
import { getDefaultArgs } from '../../utils/index.ts';

import type {
  NonOptionalSchemaAsync,
  ObjectOutput,
  ObjectSchema,
  ObjectSchemaAsync,
  ObjectShapeAsync,
} from '../../schemas/index.ts';
import type { BaseSchema, FString, PipeAsync } from '../../types.ts';
/**
 * Required object schema type.
 */
type Required<TObjectShape extends ObjectShapeAsync> = {
  [TKey in keyof TObjectShape]: NonOptionalSchemaAsync<TObjectShape[TKey]>;
};

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to none optional.
 *
 * @param schema The affected schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function requiredAsync<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>
>(
  schema: TObjectSchema,
  pipe?: PipeAsync<ObjectOutput<Required<TObjectSchema['object']>>>
): ObjectSchemaAsync<Required<TObjectSchema['object']>>;

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to none optional.
 *
 * @param schema The affected schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function requiredAsync<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>
>(
  schema: TObjectSchema,
  error?: FString,
  pipe?: PipeAsync<ObjectOutput<Required<TObjectSchema['object']>>>
): ObjectSchemaAsync<Required<TObjectSchema['object']>>;

export function requiredAsync<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>
>(
  schema: TObjectSchema,
  arg3?: PipeAsync<ObjectOutput<Required<TObjectSchema['object']>>> | FString,
  arg4?: PipeAsync<ObjectOutput<Required<TObjectSchema['object']>>>
): ObjectSchemaAsync<Required<TObjectSchema['object']>> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg3, arg4);

  // Create and return object schema
  // @ts-ignore FIXME: Remove line once bug in TS is fixed
  return objectAsync(
    Object.entries(schema.object).reduce(
      (object, [key, schema]) => ({
        ...object,
        [key]: nonOptionalAsync(schema as BaseSchema),
      }),
      {}
    ) as Required<TObjectSchema['object']>,
    error,
    // @ts-ignore FIXME: Remove line once bug in TS is fixed
    pipe
  );
}
