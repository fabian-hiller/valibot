/**
 * Maybe readonly type.
 */
export type MaybeReadonly<T> = T | Readonly<T>;

/**
 * Maybe promise type.
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Resolve type.
 *
 * Hint: This type has no effect and is only used so that TypeScript displays
 * the final type in the preview instead of the utility types used.
 */
type Resolve<T> = T;

/**
 * Resolve object type.
 *
 * Hint: This type has no effect and is only used so that TypeScript displays
 * the final type in the preview instead of the utility types used.
 */
export type ResolveObject<T> = Resolve<{ [k in keyof T]: T[k] }>;

/**
 * Extracts first tuple item.
 */
export type FirstTupleItem<T extends [unknown, ...unknown[]]> = T[0];

/**
 * Extracts last tuple item.
 */
export type LastTupleItem<T extends [unknown, ...unknown[]]> = T[T extends [
  unknown,
  ...infer Rest,
]
  ? Rest['length']
  : never];

/**
 * Converts union to intersection type.
 */
export type UnionToIntersect<TUnion> = (
  TUnion extends unknown ? (arg: TUnion) => void : never
) extends (arg: infer Intersect) => void
  ? Intersect
  : never;

/**
 * Converts union to tuple type.
 */
export type UnionToTuple<TUnion> =
  UnionToIntersect<
    TUnion extends never ? never : () => TUnion
  > extends () => infer TLast
    ? [...UnionToTuple<Exclude<TUnion, TLast>>, TLast]
    : [];
