import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types/index.ts';

/**
 * Brand symbol.
 */
export const BrandSymbol = Symbol('brand');

/**
 * Brand name type.
 */
export type BrandName = string | number | symbol;

/**
 * Brand type.
 */
export type Brand<TName extends BrandName> = {
  [BrandSymbol]: { [TValue in TName]: TValue };
};

/**
 * Schema with brand type.
 */
export type SchemaWithBrand<
  TSchema extends BaseSchema | BaseSchemaAsync,
  TName extends BrandName
> = Omit<TSchema, '_types'> & {
  _types?: {
    input: Input<TSchema>;
    output: Output<TSchema> & Brand<TName>;
  };
};

export function brand<
  TSchema extends BaseSchema | BaseSchemaAsync,
  TName extends BrandName
>(
  schema: TSchema,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  name: TName
): SchemaWithBrand<TSchema, TName> {
  return schema;
}
