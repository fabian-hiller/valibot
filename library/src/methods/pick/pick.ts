import {
  object,
  type ObjectOutput,
  type ObjectSchema,
} from '../../schemas/index.ts';
import type { BaseSchema, ErrorMessage, Pipe } from '../../types/index.ts';
import { getRestAndDefaultArgs } from '../../utils/index.ts';

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
  TSchema extends ObjectSchema<any, any>,
  TKeys extends (keyof TSchema['entries'])[]
>(
  schema: TSchema,
  keys: TKeys,
  pipe?: Pipe<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, undefined>>
): ObjectSchema<Pick<TSchema['entries'], TKeys[number]>>;

/**
 * Creates an object schema that contains only the selected keys of an existing
 * schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function pick<
  TSchema extends ObjectSchema<any, any>,
  TKeys extends (keyof TSchema['entries'])[]
>(
  schema: TSchema,
  keys: TKeys,
  message?: ErrorMessage,
  pipe?: Pipe<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, undefined>>
): ObjectSchema<Pick<TSchema['entries'], TKeys[number]>>;

/**
 * Creates an object schema that contains only the selected keys of an existing
 * schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function pick<
  TSchema extends ObjectSchema<any, any>,
  TKeys extends (keyof TSchema['entries'])[],
  TRest extends BaseSchema | undefined
>(
  schema: TSchema,
  keys: TKeys,
  rest: TRest,
  pipe?: Pipe<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, TRest>>
): ObjectSchema<Pick<TSchema['entries'], TKeys[number]>, TRest>;

/**
 * Creates an object schema that contains only the selected keys of an existing
 * schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function pick<
  TSchema extends ObjectSchema<any, any>,
  TKeys extends (keyof TSchema['entries'])[],
  TRest extends BaseSchema | undefined
>(
  schema: TSchema,
  keys: TKeys,
  rest: TRest,
  message?: ErrorMessage,
  pipe?: Pipe<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, TRest>>
): ObjectSchema<Pick<TSchema['entries'], TKeys[number]>, TRest>;

export function pick<
  TSchema extends ObjectSchema<any, any>,
  TKeys extends (keyof TSchema['entries'])[],
  TRest extends BaseSchema | undefined = undefined
>(
  schema: TSchema,
  keys: TKeys,
  arg3?:
    | Pipe<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, TRest>>
    | ErrorMessage
    | TRest,
  arg4?:
    | Pipe<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, TRest>>
    | ErrorMessage,
  arg5?: Pipe<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, TRest>>
): ObjectSchema<Pick<TSchema['entries'], TKeys[number]>, TRest> {
  // Get rest, message and pipe argument
  const [rest, message, pipe] = getRestAndDefaultArgs<
    TRest,
    Pipe<ObjectOutput<Pick<TSchema['entries'], TKeys[number]>, TRest>>
  >(arg3, arg4, arg5);

  // Create and return object schema
  return object(
    Object.entries(schema.entries).reduce(
      (entries, [key, schema]) =>
        keys.includes(key) ? { ...entries, [key]: schema } : entries,
      {}
    ) as Pick<TSchema['entries'], TKeys[number]>,
    rest,
    message,
    pipe
  );
}
