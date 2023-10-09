import {
  objectAsync,
  type ObjectOutput,
  type ObjectSchema,
  type ObjectSchemaAsync,
} from '../../schemas/index.ts';
import type { ErrorMessage, PipeAsync } from '../../types.ts';
import { getDefaultArgs } from '../../utils/index.ts';

/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function pickAsync<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>,
  TKeys extends (keyof TObjectSchema['object'])[]
>(
  schema: TObjectSchema,
  keys: TKeys,
  pipe?: PipeAsync<ObjectOutput<Pick<TObjectSchema['object'], TKeys[number]>>>
): ObjectSchemaAsync<Pick<TObjectSchema['object'], TKeys[number]>>;

/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function pickAsync<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>,
  TKeys extends (keyof TObjectSchema['object'])[]
>(
  schema: TObjectSchema,
  keys: TKeys,
  error?: ErrorMessage,
  pipe?: PipeAsync<ObjectOutput<Pick<TObjectSchema['object'], TKeys[number]>>>
): ObjectSchemaAsync<Pick<TObjectSchema['object'], TKeys[number]>>;

/**
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param arg3 A validation and transformation pipe, or an error message.
 * @param arg4 A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function pickAsync<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>,
  TKeys extends (keyof TObjectSchema['object'])[]
>(
  schema: TObjectSchema,
  keys: TKeys,
  arg3?:
    | PipeAsync<ObjectOutput<Pick<TObjectSchema['object'], TKeys[number]>>>
    | ErrorMessage,
  arg4?: PipeAsync<ObjectOutput<Pick<TObjectSchema['object'], TKeys[number]>>>
): ObjectSchemaAsync<Pick<TObjectSchema['object'], TKeys[number]>> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg3, arg4);

  // Create and return object schema
  return objectAsync(
    Object.entries(schema.object).reduce(
      (object, [key, schema]) =>
        keys.includes(key) ? { ...object, [key]: schema } : object,
      {}
    ) as Pick<TObjectSchema['object'], TKeys[number]>,
    error,
    pipe
  );
}
