import {
  objectAsync,
  type ObjectOutput,
  type ObjectSchema,
  type ObjectSchemaAsync,
} from '../../schemas/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  PipeAsync,
} from '../../types.ts';
import { getRestAndDefaultArgs } from '../../utils/index.ts';

export function pickAsync<
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends (keyof TObjectSchema['object']['entries'])[]
>(
  schema: TObjectSchema,
  keys: TKeys,
  pipe?: PipeAsync<
    ObjectOutput<
      Pick<TObjectSchema['object']['entries'], TKeys[number]>,
      undefined
    >
  >
): ObjectSchemaAsync<Pick<TObjectSchema['object']['entries'], TKeys[number]>>;

export function pickAsync<
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends (keyof TObjectSchema['object']['entries'])[]
>(
  schema: TObjectSchema,
  keys: TKeys,
  error?: ErrorMessage,
  pipe?: PipeAsync<
    ObjectOutput<
      Pick<TObjectSchema['object']['entries'], TKeys[number]>,
      undefined
    >
  >
): ObjectSchemaAsync<Pick<TObjectSchema['object']['entries'], TKeys[number]>>;

/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function pickAsync<
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends (keyof TObjectSchema['object']['entries'])[],
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  schema: TObjectSchema,
  keys: TKeys,
  rest: TObjectRest,
  pipe?: PipeAsync<
    ObjectOutput<
      Pick<TObjectSchema['object']['entries'], TKeys[number]>,
      TObjectRest
    >
  >
): ObjectSchemaAsync<
  Pick<TObjectSchema['object']['entries'], TKeys[number]>,
  TObjectRest
>;

/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function pickAsync<
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends (keyof TObjectSchema['object']['entries'])[],
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  schema: TObjectSchema,
  keys: TKeys,
  rest: TObjectRest,
  error?: ErrorMessage,
  pipe?: PipeAsync<
    ObjectOutput<
      Pick<TObjectSchema['object']['entries'], TKeys[number]>,
      TObjectRest
    >
  >
): ObjectSchemaAsync<
  Pick<TObjectSchema['object']['entries'], TKeys[number]>,
  TObjectRest
>;

/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to pick from.
 * @param keys The selected keys
 * @param arg3 A validation and transformation pipe, or the error message, or the object rest.
 * @param arg4 A validation and transformation pipe, or the error message.
 * @param arg5 A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function pickAsync<
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends (keyof TObjectSchema['object']['entries'])[],
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  schema: TObjectSchema,
  keys: TKeys,
  arg3?:
    | PipeAsync<
        ObjectOutput<
          Pick<TObjectSchema['object']['entries'], TKeys[number]>,
          TObjectRest
        >
      >
    | ErrorMessage
    | TObjectRest,
  arg4?:
    | PipeAsync<
        ObjectOutput<
          Pick<TObjectSchema['object']['entries'], TKeys[number]>,
          TObjectRest
        >
      >
    | ErrorMessage,
  arg5?: PipeAsync<
    ObjectOutput<
      Pick<TObjectSchema['object']['entries'], TKeys[number]>,
      TObjectRest
    >
  >
): ObjectSchemaAsync<
  Pick<TObjectSchema['object']['entries'], TKeys[number]>,
  TObjectRest
> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getRestAndDefaultArgs<
    TObjectRest,
    PipeAsync<
      ObjectOutput<
        Pick<TObjectSchema['object']['entries'], TKeys[number]>,
        TObjectRest
      >
    >
  >(arg3, arg4, arg5);

  // Create and return object schema
  return objectAsync(
    Object.entries(schema.object.entries).reduce(
      (entries, [key, schema]) =>
        keys.includes(key) ? { ...entries, [key]: schema } : entries,
      {}
    ) as Pick<TObjectSchema['object']['entries'], TKeys[number]>,
    rest,
    error,
    pipe
  );
}
