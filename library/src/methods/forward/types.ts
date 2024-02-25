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
      }[TValue[TKey] extends Blob | Date | Map<any, any> | Set<any>
        ? 0
        : TValue[TKey] extends any[]
          ? 1
          : TValue[TKey] extends Record<string, any>
            ? 2
            : 0],
    ]
  : never;

/**
 * Path list type.
 */
export type PathList<TInput extends unknown[] | Record<string, unknown>> =
  TInput extends any[]
    ? PathTuple<TInput, number>
    : PathTuple<TInput, keyof TInput>;
