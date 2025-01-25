import type { IsNever, MaybePromise, MaybeReadonly } from '../types/index.ts';

/**
 * Array input type.
 */
export type ArrayInput = MaybeReadonly<unknown[]>;

/**
 * Array requirement type.
 */
export type ArrayRequirement<TInput extends ArrayInput> = (
  item: TInput[number],
  index: number,
  array: TInput
) => boolean;

/**
 * Array requirement async type.
 */
export type ArrayRequirementAsync<TInput extends ArrayInput> = (
  item: TInput[number],
  index: number,
  array: TInput
) => MaybePromise<boolean>;

/**
 * Content input type.
 */
export type ContentInput = string | MaybeReadonly<unknown[]>;

/**
 * Content requirement type.
 */
export type ContentRequirement<TInput extends ContentInput> =
  TInput extends readonly unknown[] ? TInput[number] : TInput;

/**
 * Length input type.
 */
export type LengthInput = string | ArrayLike<unknown>;

/**
 * Size input type.
 */
export type SizeInput = Blob | Map<unknown, unknown> | Set<unknown>;

/**
 * Value input type.
 */
export type ValueInput = string | number | bigint | boolean | Date;

/**
 * Object input type.
 */
export type ObjectInput = Record<string | number | symbol, unknown>;

/**
 * Selected string keys type.
 */
export type SelectedStringKeys<T extends ObjectInput> = UnionToTuples<
  ExtractStringKeys<T>
>;

export type TransformedObjectOutput<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput> | undefined,
  TKeyToTransformedKey extends Record<string, string>,
> = TransformedObjectOutputHelper<TInput, TSelectedKeys, TKeyToTransformedKey>;

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
 * Extract string keys type.
 */
type ExtractStringKeys<T extends ObjectInput> = keyof {
  [K in keyof T as K extends string ? K : never]: T[K];
} &
  string;

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
 * Transformed object output helper type.
 */
type TransformedObjectOutputHelper<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput> | undefined,
  TKeyToTransformedKey extends Record<string, string>,
  // helpers to reduce computation
  TSelectedUnion extends string = StringTupleToUnion<TSelectedKeys>,
  TSelectedUnionIsNever extends boolean = IsNever<TSelectedUnion>,
  TInputKeys extends keyof TInput = keyof TInput,
> = {
  [K in keyof TInput as K extends string
    ? TSelectedUnionIsNever extends true
      ? ResultKey<K, TKeyToTransformedKey[K], TInputKeys>
      : K extends TSelectedUnion
        ? ResultKey<K, TKeyToTransformedKey[K], TInputKeys>
        : K
    : K]: TInput[K];
};
