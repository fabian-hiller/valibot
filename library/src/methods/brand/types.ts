import type { Brand, BrandSymbol } from './brand.ts';

type UnionToIntersection<T> = (
  T extends never ? never : (arg: T) => never
) extends (arg: infer U) => never
  ? U
  : never;

/**
 * Extracts all brands from a branded type.
 */
export type Brands<BrandedType> = BrandedType extends Brand<any>
  ? UnionToIntersection<
      {
        [N in keyof BrandedType[typeof BrandSymbol]]: N extends
          | string
          | symbol
          | number
          ? Brand<N>
          : never;
      }[keyof BrandedType[typeof BrandSymbol]]
    >
  : never;

/**
 * Removes all brands from a branded type or returns the type if it is not branded.
 */
export type Unbranded<BrandedType> = BrandedType extends infer T &
  Brands<BrandedType>
  ? T
  : BrandedType;
