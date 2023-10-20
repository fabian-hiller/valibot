import {
  object,
  type ObjectEntries,
  type ObjectOutput,
  type ObjectSchema,
  optional,
  type OptionalSchema,
} from '../../schemas/index.ts';
import type { BaseSchema, ErrorMessage, Pipe } from '../../types.ts';
import { getRestAndDefaultArgs } from '../../utils/index.ts';

/**
 * Partial object schema type.
 */
type Partial<TObjectEntries extends ObjectEntries> = {
  [TKey in keyof TObjectEntries]: OptionalSchema<TObjectEntries[TKey]>;
};

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to optional.
 *
 * @param schema The affected schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function partial<TObjectSchema extends ObjectSchema<any, any>>(
  schema: TObjectSchema,
  pipe?: Pipe<
    ObjectOutput<Partial<TObjectSchema['object']['entries']>, undefined>
  >
): ObjectSchema<Partial<TObjectSchema['object']['entries']>>;

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to optional.
 *
 * @param schema The affected schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function partial<TObjectSchema extends ObjectSchema<any, any>>(
  schema: TObjectSchema,
  error?: ErrorMessage,
  pipe?: Pipe<
    ObjectOutput<Partial<TObjectSchema['object']['entries']>, undefined>
  >
): ObjectSchema<Partial<TObjectSchema['object']['entries']>>;

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function partial<
  TObjectSchema extends ObjectSchema<any, any>,
  TObjectRest extends BaseSchema | undefined
>(
  schema: TObjectSchema,
  rest: TObjectRest,
  pipe?: Pipe<
    ObjectOutput<Partial<TObjectSchema['object']['entries']>, TObjectRest>
  >
): ObjectSchema<Partial<TObjectSchema['object']['entries']>, TObjectRest>;

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function partial<
  TObjectSchema extends ObjectSchema<any, any>,
  TObjectRest extends BaseSchema | undefined
>(
  schema: TObjectSchema,
  rest: TObjectRest,
  error?: ErrorMessage,
  pipe?: Pipe<
    ObjectOutput<Partial<TObjectSchema['object']['entries']>, TObjectRest>
  >
): ObjectSchema<Partial<TObjectSchema['object']['entries']>, TObjectRest>;

export function partial<
  TObjectSchema extends ObjectSchema<any, any>,
  TObjectRest extends BaseSchema | undefined = undefined
>(
  schema: TObjectSchema,
  arg2?:
    | Pipe<
        ObjectOutput<Partial<TObjectSchema['object']['entries']>, TObjectRest>
      >
    | ErrorMessage
    | TObjectRest,
  arg3?:
    | Pipe<
        ObjectOutput<Partial<TObjectSchema['object']['entries']>, TObjectRest>
      >
    | ErrorMessage,
  arg4?: Pipe<
    ObjectOutput<Partial<TObjectSchema['object']['entries']>, TObjectRest>
  >
): ObjectSchema<Partial<TObjectSchema['object']['entries']>, TObjectRest> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getRestAndDefaultArgs<
    TObjectRest,
    Pipe<ObjectOutput<Partial<TObjectSchema['object']['entries']>, TObjectRest>>
  >(arg2, arg3, arg4);

  // Create and return object schema
  return object(
    Object.entries(schema.object.entries).reduce(
      (entries, [key, schema]) => ({
        ...entries,
        [key]: optional(schema as BaseSchema),
      }),
      {}
    ) as Partial<TObjectSchema['object']['entries']>,
    rest,
    error,
    pipe
  );
}
