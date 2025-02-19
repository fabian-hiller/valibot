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
export type SelectedStringKeys<T extends ObjectInput> = (keyof T & string)[];

export type TransformedObjectOutput<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput> | undefined,
  TKeyToTransformedKey extends Record<keyof TInput & string, string>,
> = TransformedObjectOutputHelper<TInput, TSelectedKeys, TKeyToTransformedKey>;

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
 * Transformed object output helper type.
 */
type TransformedObjectOutputHelper<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput> | undefined,
  TKeyToTransformedKey extends Record<keyof TInput & string, string>,
  // helpers to reduce computation
  TSelectedUnion extends string = StringTupleToUnion<TSelectedKeys>,
  TSelectedUnionIsNever extends boolean = IsNever<TSelectedUnion>,
> = {
  [K in keyof TInput as K extends string
    ? TSelectedUnionIsNever extends true
      ? TKeyToTransformedKey[K]
      : K extends TSelectedUnion
        ? TKeyToTransformedKey[K]
        : K
    : K]: TInput[K];
};
