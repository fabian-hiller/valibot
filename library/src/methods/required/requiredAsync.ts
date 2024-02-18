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
  ErrorMessageOrMetadata,
  PipeAsync,
} from '../../types/index.ts';
import { restAndDefaultArgs } from '../../utils/index.ts';

/**
 * Required object schema type.
 */
type Required<TEntries extends ObjectEntriesAsync> = {
  [TKey in keyof TEntries]: NonOptionalSchemaAsync<TEntries[TKey]>;
};

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to non optional.
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
 * object schema set to non optional.
 *
 * @param schema The affected schema.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function requiredAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>
>(
  schema: TSchema,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: PipeAsync<ObjectOutput<Required<TSchema['entries']>, undefined>>
): ObjectSchemaAsync<Required<TSchema['entries']>>;

/**
 * Creates an async object schema consisting of all properties of an existing
 * object schema set to non optional.
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
 * object schema set to non optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param messageOrMetadata The error message or schema metadata.
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
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: PipeAsync<ObjectOutput<Required<TSchema['entries']>, TRest>>
): ObjectSchemaAsync<Required<TSchema['entries']>, TRest>;

export function requiredAsync<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
  TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  schema: TSchema,
  arg2?:
    | PipeAsync<ObjectOutput<Required<TSchema['entries']>, TRest>>
    | ErrorMessageOrMetadata
    | TRest,
  arg3?:
    | PipeAsync<ObjectOutput<Required<TSchema['entries']>, TRest>>
    | ErrorMessageOrMetadata,
  arg4?: PipeAsync<ObjectOutput<Required<TSchema['entries']>, TRest>>
): ObjectSchemaAsync<Required<TSchema['entries']>, TRest> {
  // Get rest, message and pipe argument
  const [rest, message, pipe, metadata] = restAndDefaultArgs<
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
    metadata === undefined ? message : { message, ...metadata },
    pipe
  );
}
