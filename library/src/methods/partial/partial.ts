import {
  object,
  type ObjectOutput,
  type ObjectSchema,
  type ObjectShape,
  optional,
  type OptionalSchema,
} from '../../schemas';
import type { BaseSchema, Pipe } from '../../types';
import { getErrorAndPipe } from '../../utils';

/**
 * Partial object schema type.
 */
type Partial<TObjectSchema extends ObjectShape> = {
  [TKey in keyof TObjectSchema]: OptionalSchema<TObjectSchema[TKey]>;
};

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to optional.
 *
 * @param schema The affected scheme.
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
 * @param schema The affected scheme.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function partial<TObjectSchema extends ObjectSchema<any>>(
  schema: TObjectSchema,
  error?: string,
  pipe?: Pipe<ObjectOutput<Partial<TObjectSchema['object']>>>
): ObjectSchema<Partial<TObjectSchema['object']>>;

export function partial<TObjectSchema extends ObjectSchema<any>>(
  schema: TObjectSchema,
  arg3?: Pipe<ObjectOutput<Partial<TObjectSchema['object']>>> | string,
  arg4?: Pipe<ObjectOutput<Partial<TObjectSchema['object']>>>
): ObjectSchema<Partial<TObjectSchema['object']>> {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg3, arg4);

  // Create and return object schema
  return object(
    Object.entries(schema.object).reduce(
      (object, [key, schema]) => ({
        ...object,
        [key]: optional(schema as BaseSchema),
      }),
      {}
    ) as Partial<TObjectSchema['object']>,
    error,
    pipe
  );
}
