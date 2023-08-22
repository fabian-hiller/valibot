import {
  objectAsync,
  type ObjectOutput,
  type ObjectSchema,
  type ObjectSchemaAsync,
} from '../../schemas/index.ts';
import type { PipeAsync } from '../../types.ts';
import { getDefaultArgs } from '../../utils/index.ts';
import type { ObjectKeys } from './types.ts';

/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function omitAsync<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>,
  TKeys extends ObjectKeys<TObjectSchema>
>(
  schema: TObjectSchema,
  keys: TKeys,
  pipe?: PipeAsync<ObjectOutput<Omit<TObjectSchema['object'], TKeys[number]>>>
): ObjectSchemaAsync<Omit<TObjectSchema['object'], TKeys[number]>>;

/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function omitAsync<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>,
  TKeys extends ObjectKeys<TObjectSchema>
>(
  schema: TObjectSchema,
  keys: TKeys,
  error?: string,
  pipe?: PipeAsync<ObjectOutput<Omit<TObjectSchema['object'], TKeys[number]>>>
): ObjectSchemaAsync<Omit<TObjectSchema['object'], TKeys[number]>>;

export function omitAsync<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>,
  TKeys extends ObjectKeys<TObjectSchema>
>(
  schema: TObjectSchema,
  keys: TKeys,
  arg3?:
    | PipeAsync<ObjectOutput<Omit<TObjectSchema['object'], TKeys[number]>>>
    | string,
  arg4?: PipeAsync<ObjectOutput<Omit<TObjectSchema['object'], TKeys[number]>>>
): ObjectSchemaAsync<Omit<TObjectSchema['object'], TKeys[number]>> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg3, arg4);

  // Create and return object schema
  return objectAsync(
    Object.entries(schema.object).reduce(
      (object, [key, schema]) =>
        keys.includes(key) ? object : { ...object, [key]: schema },
      {}
    ) as Omit<TObjectSchema['object'], TKeys[number]>,
    error,
    pipe
  );
}
