/**
 * Path tuple type.
 */
type PathTuple<TValue, TKey extends keyof TValue> = TKey extends TKey
  ? [
      TKey,
      ...{
        0: [];
        1: [] | PathTuple<TValue[TKey], keyof TValue[TKey] & number>;
        2: [] | PathTuple<TValue[TKey], keyof TValue[TKey]>;
      }[TValue[TKey] extends Blob | Date | Map<unknown, unknown> | Set<unknown>
        ? 0
        : TValue[TKey] extends unknown[]
          ? 1
          : TValue[TKey] extends Record<string, unknown>
            ? 2
            : 0],
    ]
  : never;

/**
 * Path keys type.
 */
export type PathKeys<TInput extends Record<string, unknown> | unknown[]> =
  TInput extends unknown[]
    ? PathTuple<TInput, number>
    : PathTuple<TInput, keyof TInput>;
