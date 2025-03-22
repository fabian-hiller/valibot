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
 * Prettifies a type for better readability.
 *
 * Hint: This type has no effect and is only used so that TypeScript displays
 * the final type in the preview instead of the utility types used.
 */
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
 * Converts union to tuple type using an accumulator.
 *
 * For more information: {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#tail-recursion-elimination-on-conditional-types}
 */
type UnionToTupleHelper<TUnion, TResult extends unknown[]> =
  UnionToIntersect<
    TUnion extends never ? never : () => TUnion
  > extends () => infer TLast
    ? UnionToTupleHelper<Exclude<TUnion, TLast>, [TLast, ...TResult]>
    : TResult;

/**
 * Converts union to tuple type.
 */
export type UnionToTuple<TUnion> = UnionToTupleHelper<TUnion, []>;

/**
 * Checks if a type is `never`.
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Checks if a type is `any`.
 */
type IsAny<Type> = 0 extends 1 & Type ? true : false;

/**
 * Extracts tuples with path keys.
 */
export type PathKeys<TValue> = MaybeReadonly<
  IsAny<TValue> extends true
    ? never
    : TValue extends readonly unknown[]
      ? number extends TValue['length']
        ? [number] | [number, ...PathKeys<TValue[number]>]
        : {
            [TKey in keyof TValue]: TKey extends `${infer TIndex extends number}`
              ? [TIndex] | [TIndex, ...PathKeys<TValue[TKey]>]
              : never;
          }[keyof TValue & number]
      : TValue extends Record<string, unknown>
        ? {
            [TKey in keyof TValue]: [TKey] | [TKey, ...PathKeys<TValue[TKey]>];
          }[keyof TValue]
        : never
>;

/**
 * Deeply picks specific keys.
 *
 * Hint: If this type is ever exported and accessible from the outside, it must
 * be wrapped in `UnionToIntersect` to avoid invalid results.
 */
type DeepPick<
  TValue,
  TPathKeys extends PathKeys<TValue>,
> = TPathKeys extends readonly [infer TPathKey, ...infer TPathRest]
  ? TValue extends readonly unknown[]
    ? number extends TValue['length']
      ? TPathRest extends PathKeys<TValue[number]>
        ? DeepPick<TValue[number], TPathRest>[]
        : TValue
      : TPathKey extends string | number
        ? {
            [TKey in keyof TValue]: TKey extends `${TPathKey}`
              ? TPathRest extends PathKeys<TValue[TKey]>
                ? DeepPick<TValue[TKey], TPathRest>
                : TValue[TKey]
              : unknown;
          }
        : never
    : {
        [TKey in keyof TValue as TKey extends TPathKey
          ? TKey
          : never]: TPathRest extends PathKeys<TValue[TKey]>
          ? DeepPick<TValue[TKey], TPathRest>
          : TValue[TKey];
      }
  : never;

/**
 * Deeply merges two types.
 */
type DeepMerge<TValue1, TValue2> = TValue1 extends readonly unknown[]
  ? TValue2 extends readonly unknown[]
    ? number extends TValue1['length'] | TValue2['length']
      ? DeepMerge<TValue1[number], TValue2[number]>[]
      : {
          [TKey in keyof TValue1]: TKey extends keyof TValue2
            ? unknown extends TValue1[TKey]
              ? TValue2[TKey]
              : TValue1[TKey]
            : never;
        }
    : never
  : TValue1 extends Record<string, unknown>
    ? TValue2 extends Record<string, unknown>
      ? {
          [TKey in keyof (TValue1 & TValue2)]: TKey extends keyof TValue1
            ? TKey extends keyof TValue2
              ? DeepMerge<TValue1[TKey], TValue2[TKey]>
              : TValue1[TKey]
            : TKey extends keyof TValue2
              ? TValue2[TKey]
              : never;
        }
      : never
    : TValue1 & TValue2;

/**
 * Deeply picks N specific keys.
 */
export type DeepPickN<
  TInput,
  TPathList extends readonly PathKeys<TInput>[],
> = TPathList extends readonly [
  infer TPathKeys extends PathKeys<TInput>,
  ...infer TRest extends PathKeys<TInput>[],
]
  ? TRest extends readonly [unknown, ...(readonly unknown[])]
    ? DeepMerge<DeepPick<TInput, TPathKeys>, DeepPickN<TInput, TRest>>
    : DeepPick<TInput, TPathKeys>
  : TInput;

/**
 * Get keys that are optional in the object.
 */
export type OptionalKeys<TObj> = keyof {
  [Key in keyof TObj as Omit<TObj, Key> extends TObj ? Key : never]: TObj[Key];
};

/**
 * If equals type.
 */
type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

/**
 * Get keys that are readonly in the object.
 */
export type ReadonlyKeys<TObj> = {
  [P in keyof TObj]-?: IfEquals<
    { [Q in P]: TObj[P] },
    { -readonly [Q in P]: TObj[P] },
    never,
    P
  >;
}[keyof TObj];
