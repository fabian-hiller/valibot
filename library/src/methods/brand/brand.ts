import type { BaseSchema, Input, Output } from '../../types';

/**
 * Brand schema type.
 */
export type BrandSchema<
  TSchema extends BaseSchema,
  TBrandName extends string | number | symbol
> = BaseSchema<Input<TSchema>, Output<TSchema> & BRAND<TBrandName>>;

const BRAND: unique symbol = Symbol('zod_brand');
export type BRAND<T extends string | number | symbol> = {
  readonly [BRAND]: { readonly [k in T]: true };
};

/**
 * Creates a brand schema.
 *
 * @param schema The base type.
 * @param brand The brand name.
 *
 * @returns A brand schema.
 */
export function brand<
  TSchema extends BaseSchema,
  const TBrandName extends string | number | symbol
>(
  schema: TSchema,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: TBrandName
): BrandSchema<TSchema, TBrandName> {
  return schema;
}
