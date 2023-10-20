import {
  enumType,
  type EnumSchema,
  type ObjectSchema,
  type ObjectSchemaAsync,
} from '../../schemas/index.ts';

/**
 * Converts union to intersection types.
 */
type UnionToIntersection<T> = (
  T extends never ? never : (arg: T) => never
) extends (arg: infer U) => never
  ? U
  : never;

/**
 * Converts union to tuple types.
 */
type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : () => T
> extends () => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];

/**
 * Returns a tuple or never type.
 */
type TupleOrNever<T> = T extends [string, ...string[]] ? T : never;

/**
 * Creates a enum schema of object keys.
 *
 * @param schema The object schema.
 *
 * @returns A enum schema.
 */
export function keyof<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>
>(
  schema: TSchema
): EnumSchema<TupleOrNever<UnionToTuple<keyof TSchema['object']['entries']>>> {
  return enumType(
    Object.keys(schema.object.entries) as TupleOrNever<
      UnionToTuple<keyof TSchema['object']['entries']>
    >
  );
}
