import {
  object,
  type ObjectOutput,
  type ObjectSchema,
} from '../../schemas/index.ts';
import type { Pipe } from '../../types.ts';
import { getErrorAndPipe } from '../../utils/index.ts';

/**
 * Creates an object schema that contains only the selected keys of an existing
 * schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function pick<
  TObjectSchema extends ObjectSchema<any>,
  TKeys extends (keyof TObjectSchema['object'])[]
>(
  schema: TObjectSchema,
  keys: TKeys,
  pipe?: Pipe<ObjectOutput<Pick<TObjectSchema['object'], TKeys[number]>>>
): ObjectSchema<Pick<TObjectSchema['object'], TKeys[number]>>;

/**
 * Creates an object schema that contains only the selected keys of an existing
 * schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function pick<
  TObjectSchema extends ObjectSchema<any>,
  TKeys extends (keyof TObjectSchema['object'])[]
>(
  schema: TObjectSchema,
  keys: TKeys,
  error?: string,
  pipe?: Pipe<ObjectOutput<Pick<TObjectSchema['object'], TKeys[number]>>>
): ObjectSchema<Pick<TObjectSchema['object'], TKeys[number]>>;

export function pick<
  TObjectSchema extends ObjectSchema<any>,
  TKeys extends (keyof TObjectSchema['object'])[]
>(
  schema: TObjectSchema,
  keys: TKeys,
  arg3?:
    | Pipe<ObjectOutput<Pick<TObjectSchema['object'], TKeys[number]>>>
    | string,
  arg4?: Pipe<ObjectOutput<Pick<TObjectSchema['object'], TKeys[number]>>>
): ObjectSchema<Pick<TObjectSchema['object'], TKeys[number]>> {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg3, arg4);

  // Create and return object schema
  return object(
    Object.entries(schema.object).reduce(
      (object, [key, schema]) =>
        keys.includes(key) ? { ...object, [key]: schema } : object,
      {}
    ) as Pick<TObjectSchema['object'], TKeys[number]>,
    error,
    pipe
  );
}
