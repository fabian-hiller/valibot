import {
  objectAsync,
  type ObjectEntriesAsync,
  type ObjectOutput,
  type ObjectSchema,
  type ObjectSchemaAsync,
  optionalAsync,
  type OptionalSchemaAsync,
} from '../../schemas/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  PipeAsync,
} from '../../types/index.ts';
import { restAndDefaultArgs } from '../../utils/index.ts';

/**
 * Partial object entries async type.
 */
export type PartialObjectEntriesAsync<TEntries extends ObjectEntriesAsync> = {
  [TKey in keyof TEntries]: OptionalSchemaAsync<TEntries[TKey]>;
};

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to optional.
 *
 * @param schema The affected schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function partialAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>
>(
  schema: TSchema,
  pipe?: PipeAsync<
    ObjectOutput<PartialObjectEntriesAsync<TSchema['entries']>, undefined>
  >
): ObjectSchemaAsync<PartialObjectEntriesAsync<TSchema['entries']>>;

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to optional.
 *
 * @param schema The affected schema.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function partialAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>
>(
  schema: TSchema,
  message?: ErrorMessage,
  pipe?: PipeAsync<
    ObjectOutput<PartialObjectEntriesAsync<TSchema['entries']>, undefined>
  >
): ObjectSchemaAsync<PartialObjectEntriesAsync<TSchema['entries']>>;

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function partialAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TRest extends BaseSchema | undefined
>(
  schema: TSchema,
  rest: TRest,
  pipe?: PipeAsync<
    ObjectOutput<PartialObjectEntriesAsync<TSchema['entries']>, TRest>
  >
): ObjectSchemaAsync<PartialObjectEntriesAsync<TSchema['entries']>, TRest>;

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function partialAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TRest extends BaseSchema | undefined
>(
  schema: TSchema,
  rest: TRest,
  message?: ErrorMessage,
  pipe?: PipeAsync<
    ObjectOutput<PartialObjectEntriesAsync<TSchema['entries']>, TRest>
  >
): ObjectSchemaAsync<PartialObjectEntriesAsync<TSchema['entries']>, TRest>;

export function partialAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TRest extends BaseSchema | undefined = undefined
>(
  schema: TSchema,
  arg2?:
    | PipeAsync<
        ObjectOutput<PartialObjectEntriesAsync<TSchema['entries']>, TRest>
      >
    | ErrorMessage
    | TRest,
  arg3?:
    | PipeAsync<
        ObjectOutput<PartialObjectEntriesAsync<TSchema['entries']>, TRest>
      >
    | ErrorMessage,
  arg4?: PipeAsync<
    ObjectOutput<PartialObjectEntriesAsync<TSchema['entries']>, TRest>
  >
): ObjectSchemaAsync<PartialObjectEntriesAsync<TSchema['entries']>, TRest> {
  // Get rest, message and pipe argument
  const [rest, message, pipe] = restAndDefaultArgs<
    TRest,
    PipeAsync<
      ObjectOutput<PartialObjectEntriesAsync<TSchema['entries']>, TRest>
    >
  >(arg2, arg3, arg4);

  // Create and return object schema
  return objectAsync(
    Object.entries(schema.entries).reduce(
      (entries, [key, schema]) => ({
        ...entries,
        [key]: optionalAsync(schema as BaseSchema | BaseSchemaAsync),
      }),
      {}
    ) as PartialObjectEntriesAsync<TSchema['entries']>,
    rest,
    message,
    pipe
  );
}
