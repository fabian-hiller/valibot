import type { IsNever } from '../../types/utils.ts';
import type { ObjectInput } from '../types.ts';

/**
 * Selected string keys type.
 */
export type SelectedStringKeys<T extends ObjectInput> = UnionToTuples<
  ExtractStringKeys<T>
>;

/**
 * Output type.
 */
export type Output<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput> | undefined,
> = OutputHelper<TInput, TSelectedKeys>;

/**
 * String tuple to union type.
 */
type StringTupleToUnion<
  T extends string[] | undefined,
  TResult extends string = never,
> = T extends [infer TCh extends string, ...infer TRemaining extends string[]]
  ? StringTupleToUnion<TRemaining, TResult | TCh>
  : TResult;

/**
 * Extract string keys type.
 */
type ExtractStringKeys<T extends ObjectInput> = keyof {
  [K in keyof T as K extends string ? K : never]: T[K];
} &
  string;

/**
 * Union to tuples type.
 */
type UnionToTuples<
  TInput extends string,
  TResult extends string[] = never,
  TInputCopy extends string = TInput,
> =
  IsNever<TInput> extends true
    ? TResult
    : // conditional type to trigger distribution
      // See: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      TInput extends any
      ? UnionToTuples<
          Exclude<TInputCopy, TInput>,
          TResult | [TInput] | [...TResult, TInput]
        >
      : never;

/**
 * Result key type.
 */
type ResultKey<
  TKey extends string,
  TTransformedKey extends string,
  TInputKeys extends string | number | symbol,
> = TKey extends TTransformedKey
  ? TKey
  : TTransformedKey extends TInputKeys
    ? never
    : TTransformedKey;

/**
 * Output helper type.
 */
type OutputHelper<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput> | undefined,
  // helpers to reduce computation
  TSelectedUnion extends string = StringTupleToUnion<TSelectedKeys>,
  TSelectedUnionIsNever extends boolean = IsNever<TSelectedUnion>,
  TInputKeys extends keyof TInput = keyof TInput,
> = {
  [K in keyof TInput as K extends string
    ? TSelectedUnionIsNever extends true
      ? ResultKey<K, ToSnakeCase<K>, TInputKeys>
      : K extends TSelectedUnion
        ? ResultKey<K, ToSnakeCase<K>, TInputKeys>
        : K
    : K]: TInput[K];
};

/**
 * To snake case type.
 */
type ToSnakeCase<
  TInput extends string,
  TResult extends string = '',
> = TInput extends `${infer TCh}${infer TRemaining}`
  ? ToSnakeCase<
      TRemaining,
      `${TResult}${TResult extends '' ? TCh : TCh extends Uppercase<TCh> ? (TCh extends Lowercase<TCh> ? TCh : `_${Lowercase<TCh>}`) : TCh}`
    >
  : TResult;
