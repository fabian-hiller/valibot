import type {
  ObjectOutput,
  ObjectSchema,
  ObjectSchemaAsync,
} from '../../schemas/index.ts';
import { objectAsync } from '../../schemas/index.ts';
import { getDefaultArgs } from '../../utils/index.ts';

import type { FString, PipeAsync } from '../../types.ts';
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
  error?: FString,
  pipe?: PipeAsync<ObjectOutput<Pick<TObjectSchema['object'], TKeys[number]>>>
): ObjectSchemaAsync<Pick<TObjectSchema['object'], TKeys[number]>>;

export function pickAsync<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>,
  TKeys extends (keyof TObjectSchema['object'])[]
>(
  schema: TObjectSchema,
  keys: TKeys,
  arg3?:
    | PipeAsync<ObjectOutput<Pick<TObjectSchema['object'], TKeys[number]>>>
    | FString,
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
