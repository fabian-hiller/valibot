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
  ObjectKeys,
  PipeAsync,
} from '../../types/index.ts';
import { restAndDefaultArgs } from '../../utils/index.ts';

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
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends ObjectKeys<TSchema>,
>(
  schema: TSchema,
  keys: TKeys,
  pipe?: PipeAsync<
    ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, undefined>
  >
): ObjectSchemaAsync<Omit<TSchema['entries'], TKeys[number]>>;

/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function omitAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends ObjectKeys<TSchema>,
>(
  schema: TSchema,
  keys: TKeys,
  message?: ErrorMessage,
  pipe?: PipeAsync<
    ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, undefined>
  >
): ObjectSchemaAsync<Omit<TSchema['entries'], TKeys[number]>>;

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
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends ObjectKeys<TSchema>,
  TRest extends BaseSchema | BaseSchemaAsync | undefined,
>(
  schema: TSchema,
  keys: TKeys,
  rest: TRest,
  pipe?: PipeAsync<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, TRest>>
): ObjectSchemaAsync<Omit<TSchema['entries'], TKeys[number]>, TRest>;

/**
 * Creates an async object schema that contains only the selected keys of an
 * existing schema.
 *
 * @param schema The schema to omit from.
 * @param keys The selected keys
 * @param rest The object rest.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function omitAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends ObjectKeys<TSchema>,
  TRest extends BaseSchema | BaseSchemaAsync | undefined,
>(
  schema: TSchema,
  keys: TKeys,
  rest: TRest,
  message?: ErrorMessage,
  pipe?: PipeAsync<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, TRest>>
): ObjectSchemaAsync<Omit<TSchema['entries'], TKeys[number]>, TRest>;

export function omitAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TKeys extends ObjectKeys<TSchema>,
  TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined,
>(
  schema: TSchema,
  keys: TKeys,
  arg3?:
    | PipeAsync<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, TRest>>
    | ErrorMessage
    | TRest,
  arg4?:
    | PipeAsync<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, TRest>>
    | ErrorMessage,
  arg5?: PipeAsync<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, TRest>>
): ObjectSchemaAsync<Omit<TSchema['entries'], TKeys[number]>, TRest> {
  // Get rest, message and pipe argument
  const [rest, message, pipe] = restAndDefaultArgs<
    TRest,
    PipeAsync<ObjectOutput<Omit<TSchema['entries'], TKeys[number]>, TRest>>
  >(arg3, arg4, arg5);

  // Create and return object schema
  return objectAsync(
    Object.entries(schema.entries).reduce(
      (entries, [key, schema]) =>
        keys.includes(key) ? entries : { ...entries, [key]: schema },
      {}
    ) as Omit<TSchema['entries'], TKeys[number]>,
    rest,
    message,
    pipe
  );
}
