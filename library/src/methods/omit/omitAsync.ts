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
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends ObjectKeys<TObjectSchema>
>(
  schema: TObjectSchema,
  keys: TKeys,
  pipe?: PipeAsync<
    ObjectOutput<
      Omit<TObjectSchema['object']['entries'], TKeys[number]>,
      undefined
    >
  >
): ObjectSchemaAsync<Omit<TObjectSchema['object']['entries'], TKeys[number]>>;

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
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends ObjectKeys<TObjectSchema>
>(
  schema: TObjectSchema,
  keys: TKeys,
  error?: ErrorMessage,
  pipe?: PipeAsync<
    ObjectOutput<
      Omit<TObjectSchema['object']['entries'], TKeys[number]>,
      undefined
    >
  >
): ObjectSchemaAsync<Omit<TObjectSchema['object']['entries'], TKeys[number]>>;

/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function omitAsync<
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends ObjectKeys<TObjectSchema>,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  schema: TObjectSchema,
  keys: TKeys,
  rest: TObjectRest,
  pipe?: PipeAsync<
    ObjectOutput<
      Omit<TObjectSchema['object']['entries'], TKeys[number]>,
      TObjectRest
    >
  >
): ObjectSchemaAsync<
  Omit<TObjectSchema['object']['entries'], TKeys[number]>,
  TObjectRest
>;

/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function omitAsync<
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends ObjectKeys<TObjectSchema>,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  schema: TObjectSchema,
  keys: TKeys,
  rest: TObjectRest,
  error?: ErrorMessage,
  pipe?: PipeAsync<
    ObjectOutput<
      Omit<TObjectSchema['object']['entries'], TKeys[number]>,
      TObjectRest
    >
  >
): ObjectSchemaAsync<
  Omit<TObjectSchema['object']['entries'], TKeys[number]>,
  TObjectRest
>;

export function omitAsync<
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends ObjectKeys<TObjectSchema>,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  schema: TObjectSchema,
  keys: TKeys,
  arg3?:
    | PipeAsync<
        ObjectOutput<
          Omit<TObjectSchema['object']['entries'], TKeys[number]>,
          TObjectRest
        >
      >
    | ErrorMessage
    | TObjectRest,
  arg4?:
    | PipeAsync<
        ObjectOutput<
          Omit<TObjectSchema['object']['entries'], TKeys[number]>,
          TObjectRest
        >
      >
    | ErrorMessage,
  arg5?: PipeAsync<
    ObjectOutput<
      Omit<TObjectSchema['object']['entries'], TKeys[number]>,
      TObjectRest
    >
  >
): ObjectSchemaAsync<
  Omit<TObjectSchema['object']['entries'], TKeys[number]>,
  TObjectRest
> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getRestAndDefaultArgs<
    TObjectRest,
    PipeAsync<
      ObjectOutput<
        Omit<TObjectSchema['object']['entries'], TKeys[number]>,
        TObjectRest
      >
    >
  >(arg3, arg4, arg5);

  // Create and return object schema
  return objectAsync(
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
