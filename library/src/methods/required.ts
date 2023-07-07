import {
  nonOptional,
  type NonOptionalSchema,
  object,
  type ObjectOutput,
  type ObjectSchema,
  type ObjectShape,
} from '../schemas';
import type { BaseSchema, Pipe } from '../types';
import { getErrorAndPipe } from '../utils';

/**
 * Required object schema type.
 */
type Required<TObjectSchema extends ObjectShape> = {
  [TKey in keyof TObjectSchema]: NonOptionalSchema<TObjectSchema[TKey]>;
};

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected scheme.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function required<TObjectSchema extends ObjectSchema<any>>(
  schema: TObjectSchema,
  pipe?: Pipe<ObjectOutput<Required<TObjectSchema['object']>>>
): ObjectSchema<Required<TObjectSchema['object']>>;

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected scheme.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function required<TObjectSchema extends ObjectSchema<any>>(
  schema: TObjectSchema,
  error?: string,
  pipe?: Pipe<ObjectOutput<Required<TObjectSchema['object']>>>
): ObjectSchema<Required<TObjectSchema['object']>>;

export function required<TObjectSchema extends ObjectSchema<any>>(
  schema: TObjectSchema,
  arg3?: Pipe<ObjectOutput<Required<TObjectSchema['object']>>> | string,
  arg4?: Pipe<ObjectOutput<Required<TObjectSchema['object']>>>
): ObjectSchema<Required<TObjectSchema['object']>> {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg3, arg4);

  // Create and return object schema
  return object(
    Object.entries(schema.object).reduce(
      (object, [key, schema]) => ({
        ...object,
        [key]: nonOptional(schema as BaseSchema),
      }),
      {}
    ) as Required<TObjectSchema['object']>,
    error,
    pipe
  );
}
