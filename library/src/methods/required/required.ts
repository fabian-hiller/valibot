import {
  nonOptional,
  type NonOptionalSchema,
  object,
  type ObjectEntries,
  type ObjectOutput,
  type ObjectSchema,
} from '../../schemas/index.ts';
import type { BaseSchema, ErrorMessage, Pipe } from '../../types.ts';
import { getRestAndDefaultArgs } from '../../utils/index.ts';

/**
 * Required object schema type.
 */
type Required<TObjectEntries extends ObjectEntries> = {
  [TKey in keyof TObjectEntries]: NonOptionalSchema<TObjectEntries[TKey]>;
};

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function required<TObjectSchema extends ObjectSchema<any, any>>(
  schema: TObjectSchema,
  pipe?: Pipe<
    ObjectOutput<Required<TObjectSchema['object']['entries']>, undefined>
  >
): ObjectSchema<Required<TObjectSchema['object']['entries']>>;

export function required<TObjectSchema extends ObjectSchema<any>>(
  schema: TObjectSchema,
  error?: ErrorMessage,
  pipe?: Pipe<
    ObjectOutput<Required<TObjectSchema['object']['entries']>, undefined>
  >
): ObjectSchema<Required<TObjectSchema['object']['entries']>>;

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected schema.
 * @param arg3 A validation and transformation pipe, or an error message.
 * @param arg4 A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function required<TObjectSchema extends ObjectSchema<any, any>>(
  schema: TObjectSchema,
  error?: ErrorMessage,
  pipe?: Pipe<
    ObjectOutput<Required<TObjectSchema['object']['entries']>, undefined>
  >
): ObjectSchema<Required<TObjectSchema['object']['entries']>>;

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function required<
  TObjectSchema extends ObjectSchema<any, any>,
  TObjectRest extends BaseSchema | undefined
>(
  schema: TObjectSchema,
  rest: TObjectRest,
  pipe?: Pipe<
    ObjectOutput<Required<TObjectSchema['object']['entries']>, TObjectRest>
  >
): ObjectSchema<Required<TObjectSchema['object']['entries']>, TObjectRest>;

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function required<
  TObjectSchema extends ObjectSchema<any, any>,
  TObjectRest extends BaseSchema | undefined
>(
  schema: TObjectSchema,
  rest: TObjectRest,
  error?: ErrorMessage,
  pipe?: Pipe<
    ObjectOutput<Required<TObjectSchema['object']['entries']>, TObjectRest>
  >
): ObjectSchema<Required<TObjectSchema['object']['entries']>, TObjectRest>;

export function required<
  TObjectSchema extends ObjectSchema<any, any>,
  TObjectRest extends BaseSchema | undefined = undefined
>(
  schema: TObjectSchema,
  arg2?:
    | Pipe<
        ObjectOutput<Required<TObjectSchema['object']['entries']>, TObjectRest>
      >
    | ErrorMessage
    | TObjectRest,
  arg3?:
    | Pipe<
        ObjectOutput<Required<TObjectSchema['object']['entries']>, TObjectRest>
      >
    | ErrorMessage,
  arg4?: Pipe<
    ObjectOutput<Required<TObjectSchema['object']['entries']>, TObjectRest>
  >
): ObjectSchema<Required<TObjectSchema['object']['entries']>, TObjectRest> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getRestAndDefaultArgs<
    TObjectRest,
    Pipe<
      ObjectOutput<Required<TObjectSchema['object']['entries']>, TObjectRest>
    >
  >(arg2, arg3, arg4);

  // Create and return object schema
  return object(
    Object.entries(schema.object.entries).reduce(
      (entries, [key, schema]) => ({
        ...entries,
        [key]: nonOptional(schema as BaseSchema),
      }),
      {}
    ) as Required<TObjectSchema['object']['entries']>,
    rest,
    error,
    pipe
  );
}
