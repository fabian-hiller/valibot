/**
 * Extracts `null` from a type.
 */
export type NonNullable<TValue> = TValue extends null ? never : TValue;

/**
 * Extracts `null` and `undefined` from a type.
 */
export type NonNullish<TValue> = TValue extends null | undefined
  ? never
  : TValue;

/**
 * Extracts `undefined` from a type.
 */
export type NonOptional<TValue> = TValue extends undefined ? never : TValue;

/**
 * Constructs a type that is maybe readonly.
 */
export type MaybeReadonly<TValue> = TValue | Readonly<TValue>;

/**
 * Constructs a type that is maybe a promise.
 */
export type MaybePromise<TValue> = TValue | Promise<TValue>;

/**
 * Flattens a type for better readability.
 *
 * Hint: This type has no effect and is only used so that TypeScript displays
 * the final type in the preview instead of the utility types used.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type Prettify<TObject> = { [TKey in keyof TObject]: TObject[TKey] } & {};

/**
 * Marks specific keys as optional.
 */
export type MarkOptional<TObject, TKeys extends keyof TObject> = Omit<
  TObject,
  TKeys
> &
  Partial<Pick<TObject, TKeys>>;

/**
 * Extracts first tuple item.
 */
export type FirstTupleItem<TTuple extends [unknown, ...unknown[]]> = TTuple[0];

/**
 * Extracts last tuple item.
 */
export type LastTupleItem<TTuple extends [unknown, ...unknown[]]> =
  TTuple[TTuple extends [unknown, ...infer TRest] ? TRest['length'] : never];

/**
 * Converts union to intersection type.
 */
export type UnionToIntersect<TUnion> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (TUnion extends any ? (arg: TUnion) => void : never) extends (
    arg: infer Intersect
  ) => void
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
