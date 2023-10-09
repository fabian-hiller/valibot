import {
  object,
  type ObjectOutput,
  type ObjectSchema,
} from '../../schemas/index.ts';
import type { ErrorMessage, Pipe } from '../../types.ts';
import { getDefaultArgs } from '../../utils/index.ts';
import type { ObjectKeys } from './types.ts';

export function omit<
  TObjectSchema extends ObjectSchema<any>,
  TKeys extends ObjectKeys<TObjectSchema>
>(
  schema: TObjectSchema,
  keys: TKeys,
  pipe?: Pipe<ObjectOutput<Omit<TObjectSchema['object'], TKeys[number]>>>
): ObjectSchema<Omit<TObjectSchema['object'], TKeys[number]>>;

export function omit<
  TObjectSchema extends ObjectSchema<any>,
  TKeys extends ObjectKeys<TObjectSchema>
>(
  schema: TObjectSchema,
  keys: TKeys,
  error?: ErrorMessage,
  pipe?: Pipe<ObjectOutput<Omit<TObjectSchema['object'], TKeys[number]>>>
): ObjectSchema<Omit<TObjectSchema['object'], TKeys[number]>>;

/**
 * Creates an object schema that contains not the selected keys of an existing
 * schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param arg3 A validation and transformation pipe, or an error message.
 * @param arg4 A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function omit<
  TObjectSchema extends ObjectSchema<any>,
  TKeys extends ObjectKeys<TObjectSchema>
>(
  schema: TObjectSchema,
  keys: TKeys,
  arg3?:
    | Pipe<ObjectOutput<Omit<TObjectSchema['object'], TKeys[number]>>>
    | ErrorMessage,
  arg4?: Pipe<ObjectOutput<Omit<TObjectSchema['object'], TKeys[number]>>>
): ObjectSchema<Omit<TObjectSchema['object'], TKeys[number]>> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg3, arg4);

  // Create and return object schema
  return object(
    Object.entries(schema.object).reduce(
      (object, [key, schema]) =>
        keys.includes(key) ? object : { ...object, [key]: schema },
      {}
    ) as Omit<TObjectSchema['object'], TKeys[number]>,
    error,
    pipe
  );
}
