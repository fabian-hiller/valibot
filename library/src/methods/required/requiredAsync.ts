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
type Required<TObjectEntries extends ObjectEntriesAsync> = {
  [TKey in keyof TObjectEntries]: NonOptionalSchemaAsync<TObjectEntries[TKey]>;
};

export function requiredAsync<
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>
>(
  schema: TObjectSchema,
  pipe?: PipeAsync<
    ObjectOutput<Required<TObjectSchema['object']['entries']>, undefined>
  >
): ObjectSchemaAsync<Required<TObjectSchema['object']['entries']>>;

export function requiredAsync<
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>
>(
  schema: TObjectSchema,
  error?: ErrorMessage,
  pipe?: PipeAsync<
    ObjectOutput<Required<TObjectSchema['object']['entries']>, undefined>
  >
): ObjectSchemaAsync<Required<TObjectSchema['object']['entries']>>;

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
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  schema: TObjectSchema,
  rest: TObjectRest,
  pipe?: PipeAsync<
    ObjectOutput<Required<TObjectSchema['object']['entries']>, TObjectRest>
  >
): ObjectSchemaAsync<Required<TObjectSchema['object']['entries']>, TObjectRest>;

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
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  schema: TObjectSchema,
  rest: TObjectRest,
  error?: ErrorMessage,
  pipe?: PipeAsync<
    ObjectOutput<Required<TObjectSchema['object']['entries']>, TObjectRest>
  >
): ObjectSchemaAsync<Required<TObjectSchema['object']['entries']>, TObjectRest>;

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to none optional.
 *
 * @param schema The affected schema.
 * @param arg2 A validation and transformation pipe, or the error message, or the object rest.
 * @param arg3 A validation and transformation pipe, or the error message.
 * @param arg4 A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function requiredAsync<
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  schema: TObjectSchema,
  arg2?:
    | PipeAsync<
        ObjectOutput<Required<TObjectSchema['object']['entries']>, TObjectRest>
      >
    | ErrorMessage
    | TObjectRest,
  arg3?:
    | PipeAsync<
        ObjectOutput<Required<TObjectSchema['object']['entries']>, TObjectRest>
      >
    | ErrorMessage,
  arg4?: PipeAsync<
    ObjectOutput<Required<TObjectSchema['object']['entries']>, TObjectRest>
  >
): ObjectSchemaAsync<
  Required<TObjectSchema['object']['entries']>,
  TObjectRest
> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getRestAndDefaultArgs<
    TObjectRest,
    PipeAsync<
      ObjectOutput<Required<TObjectSchema['object']['entries']>, TObjectRest>
    >
  >(arg2, arg3, arg4);

  // Create and return object schema
  return objectAsync(
    Object.entries(schema.object.entries).reduce(
      (entries, [key, schema]) => ({
        ...entries,
        [key]: nonOptionalAsync(schema as BaseSchema | BaseSchemaAsync),
      }),
      {}
    ) as Required<TObjectSchema['object']['entries']>,
    rest,
    error,
    pipe
  );
}
