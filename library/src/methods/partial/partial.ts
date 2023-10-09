import {
  object,
  type ObjectOutput,
  type ObjectSchema,
  type ObjectShape,
  optional,
  type OptionalSchema,
} from '../../schemas/index.ts';
import type { BaseSchema, ErrorMessage, Pipe } from '../../types.ts';
import { getDefaultArgs } from '../../utils/index.ts';

/**
 * Partial object schema type.
 */
type Partial<TObjectShape extends ObjectShape> = {
  [TKey in keyof TObjectShape]: OptionalSchema<TObjectShape[TKey]>;
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
export function partial<TObjectSchema extends ObjectSchema<any>>(
  schema: TObjectSchema,
  pipe?: Pipe<ObjectOutput<Partial<TObjectSchema['object']>>>
): ObjectSchema<Partial<TObjectSchema['object']>>;

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
export function partial<TObjectSchema extends ObjectSchema<any>>(
  schema: TObjectSchema,
  error?: ErrorMessage,
  pipe?: Pipe<ObjectOutput<Partial<TObjectSchema['object']>>>
): ObjectSchema<Partial<TObjectSchema['object']>>;

/**
 *
 * @param schema The affected schema.
 * @param arg3 A validation and transformation pipe, or an error message.
 * @param arg4 A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function partial<TObjectSchema extends ObjectSchema<any>>(
  schema: TObjectSchema,
  arg3?: Pipe<ObjectOutput<Partial<TObjectSchema['object']>>> | ErrorMessage,
  arg4?: Pipe<ObjectOutput<Partial<TObjectSchema['object']>>>
): ObjectSchema<Partial<TObjectSchema['object']>> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg3, arg4);

  // Create and return object schema
  // @ts-ignore FIXME: Remove line once bug in TS is fixed
  return object(
    Object.entries(schema.object).reduce(
      (object, [key, schema]) => ({
        ...object,
        [key]: optional(schema as BaseSchema),
      }),
      {}
    ) as Partial<TObjectSchema['object']>,
    error,
    // @ts-ignore FIXME: Remove line once bug in TS is fixed
    pipe
  );
}
