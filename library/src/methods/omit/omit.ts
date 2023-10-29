import {
  object,
  type ObjectOutput,
  type ObjectSchema,
} from '../../schemas/index.ts';
import type { BaseSchema, ErrorMessage, Pipe } from '../../types.ts';
import { getRestAndDefaultArgs } from '../../utils/index.ts';
import type { ObjectKeys } from './types.ts';

export function omit<
  TObjectSchema extends ObjectSchema<any, any>,
  TKeys extends ObjectKeys<TObjectSchema>
>(
  schema: TObjectSchema,
  keys: TKeys,
  pipe?: Pipe<
    ObjectOutput<
      Omit<TObjectSchema['object']['entries'], TKeys[number]>,
      undefined
    >
  >
): ObjectSchema<Omit<TObjectSchema['object']['entries'], TKeys[number]>>;

export function omit<
  TObjectSchema extends ObjectSchema<any, any>,
  TKeys extends ObjectKeys<TObjectSchema>
>(
  schema: TObjectSchema,
  keys: TKeys,
  error?: ErrorMessage,
  pipe?: Pipe<
    ObjectOutput<
      Omit<TObjectSchema['object']['entries'], TKeys[number]>,
      undefined
    >
  >
): ObjectSchema<Omit<TObjectSchema['object']['entries'], TKeys[number]>>;

/**
 * Creates an object schema that contains not the selected keys of an existing
 * schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function omit<
  TObjectSchema extends ObjectSchema<any, any>,
  TKeys extends ObjectKeys<TObjectSchema>,
  TObjectRest extends BaseSchema | undefined
>(
  schema: TObjectSchema,
  keys: TKeys,
  rest: TObjectRest,
  pipe?: Pipe<
    ObjectOutput<
      Omit<TObjectSchema['object']['entries'], TKeys[number]>,
      TObjectRest
    >
  >
): ObjectSchema<
  Omit<TObjectSchema['object']['entries'], TKeys[number]>,
  TObjectRest
>;

/**
 * Creates an object schema that contains not the selected keys of an existing
 * schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function omit<
  TObjectSchema extends ObjectSchema<any, any>,
  TKeys extends ObjectKeys<TObjectSchema>,
  TObjectRest extends BaseSchema | undefined
>(
  schema: TObjectSchema,
  keys: TKeys,
  rest: TObjectRest,
  error?: ErrorMessage,
  pipe?: Pipe<
    ObjectOutput<
      Omit<TObjectSchema['object']['entries'], TKeys[number]>,
      TObjectRest
    >
  >
): ObjectSchema<
  Omit<TObjectSchema['object']['entries'], TKeys[number]>,
  TObjectRest
>;

export function omit<
  TObjectSchema extends ObjectSchema<any, any>,
  TKeys extends ObjectKeys<TObjectSchema>,
  TObjectRest extends BaseSchema | undefined = undefined
>(
  schema: TObjectSchema,
  keys: TKeys,
  arg3?:
    | Pipe<
        ObjectOutput<
          Omit<TObjectSchema['object']['entries'], TKeys[number]>,
          TObjectRest
        >
      >
    | ErrorMessage
    | TObjectRest,
  arg4?:
    | Pipe<
        ObjectOutput<
          Omit<TObjectSchema['object']['entries'], TKeys[number]>,
          TObjectRest
        >
      >
    | ErrorMessage,
  arg5?: Pipe<
    ObjectOutput<
      Omit<TObjectSchema['object']['entries'], TKeys[number]>,
      TObjectRest
    >
  >
): ObjectSchema<
  Omit<TObjectSchema['object']['entries'], TKeys[number]>,
  TObjectRest
> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getRestAndDefaultArgs<
    TObjectRest,
    Pipe<
      ObjectOutput<
        Omit<TObjectSchema['object']['entries'], TKeys[number]>,
        TObjectRest
      >
    >
  >(arg3, arg4, arg5);

  // Create and return object schema
  return object(
    Object.entries(schema.object.entries).reduce(
      (entries, [key, schema]) =>
        keys.includes(key) ? entries : { ...entries, [key]: schema },
      {}
    ) as Omit<TObjectSchema['object']['entries'], TKeys[number]>,
    rest,
    error,
    pipe
  );
}
