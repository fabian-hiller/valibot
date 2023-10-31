import {
  nonOptionalAsync,
  type NonOptionalSchemaAsync,
  objectAsync,
  type ObjectEntriesAsync,
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

/**
 * Required object schema type.
 */
type Required<TEntries extends ObjectEntriesAsync> = {
  [TKey in keyof TEntries]: NonOptionalSchemaAsync<TEntries[TKey]>;
};

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to none optional.
 *
 * @param schema The affected schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function requiredAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>
>(
  schema: TSchema,
  pipe?: PipeAsync<ObjectOutput<Required<TSchema['entries']>, undefined>>
): ObjectSchemaAsync<Required<TSchema['entries']>>;

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to none optional.
 *
 * @param schema The affected schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function requiredAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>
>(
  schema: TSchema,
  error?: ErrorMessage,
  pipe?: PipeAsync<ObjectOutput<Required<TSchema['entries']>, undefined>>
): ObjectSchemaAsync<Required<TSchema['entries']>>;

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to none optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function requiredAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  schema: TSchema,
  rest: TRest,
  pipe?: PipeAsync<ObjectOutput<Required<TSchema['entries']>, TRest>>
): ObjectSchemaAsync<Required<TSchema['entries']>, TRest>;

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to none optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function requiredAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  schema: TSchema,
  rest: TRest,
  error?: ErrorMessage,
  pipe?: PipeAsync<ObjectOutput<Required<TSchema['entries']>, TRest>>
): ObjectSchemaAsync<Required<TSchema['entries']>, TRest>;

export function requiredAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  schema: TSchema,
  arg2?:
    | PipeAsync<ObjectOutput<Required<TSchema['entries']>, TRest>>
    | ErrorMessage
    | TRest,
  arg3?:
    | PipeAsync<ObjectOutput<Required<TSchema['entries']>, TRest>>
    | ErrorMessage,
  arg4?: PipeAsync<ObjectOutput<Required<TSchema['entries']>, TRest>>
): ObjectSchemaAsync<Required<TSchema['entries']>, TRest> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getRestAndDefaultArgs<
    TRest,
    PipeAsync<ObjectOutput<Required<TSchema['entries']>, TRest>>
  >(arg2, arg3, arg4);

  // Create and return object schema
  return objectAsync(
    Object.entries(schema.entries).reduce(
      (entries, [key, schema]) => ({
        ...entries,
        [key]: nonOptionalAsync(schema as BaseSchema | BaseSchemaAsync),
      }),
      {}
    ) as Required<TSchema['entries']>,
    rest,
    error,
    pipe
  );
}
