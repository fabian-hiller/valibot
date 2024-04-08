import type { BaseTransformation, TypedDataset } from '../../types/index.ts';

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
export interface Brand<TName extends BrandName> {
  [BrandSymbol]: { [TValue in TName]: TValue };
}

/**
 * Brand action type.
 */
export interface BrandAction<TInput, TName extends BrandName>
  extends BaseTransformation<TInput, TInput & Brand<TName>, never> {
  /**
   * The action type.
   */
  readonly type: 'brand';
  /**
   * The brand name.
   */
  readonly name: TName;
}

/**
 * Creates a brand transformation action.
 *
 * @param name The brand name.
 *
 * @returns A brand action.
 */
export function brand<TInput, TName extends BrandName>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  name: TName
): BrandAction<TInput, TName> {
  return {
    kind: 'transformation',
    type: 'brand',
    name,
    async: false,
    _run(dataset) {
      return dataset as TypedDataset<TInput & Brand<TName>, never>;
    },
  };
}
