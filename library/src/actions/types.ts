import type {
  IsNever,
  MaybePromise,
  MaybeReadonly,
  OptionalKeys,
  Prettify,
  ReadonlyKeys,
} from '../types/index.ts';

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
export type SelectedStringKeys<TInput extends ObjectInput> =
  StringKeyOf<TInput>[];

/**
 * Transformed keys object type.
 */
export type TransformedKeysObject<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput> | undefined,
  TKeyToTransformed extends Record<StringKeyOf<TInput>, string>,
> = TransformedKeysObjectHelper<
  TInput,
  TSelectedKeys extends SelectedStringKeys<TInput>
    ? TSelectedKeys[number]
    : StringKeyOf<TInput>,
  TKeyToTransformed
>;

/**
 * Extract string keys of the object.
 */
type StringKeyOf<TObj extends ObjectInput> = keyof TObj & string;

/**
 * Check if at least one key is readonly.
 */
type AtLeastOneReadonly<TKey extends string, TReadonlyKey extends string> =
  IsNever<TReadonlyKey & TKey> extends true ? false : true;

/**
 * Transformed keys object helper type.
 */
type TransformedKeysObjectHelper<
  TInput extends ObjectInput,
  TSelectedKeys extends StringKeyOf<TInput>,
  TKeyToTransformed extends Record<StringKeyOf<TInput>, string>,
  TTransformedToKey extends Record<
    string,
    StringKeyOf<TInput>
  > = GetTransformedToKey<TInput, TSelectedKeys, TKeyToTransformed>,
  TOptionalKeys extends StringKeyOf<TInput> = OptionalKeys<TInput> & string,
  TReadonlyKeys extends StringKeyOf<TInput> = ReadonlyKeys<TInput> & string,
> = Prettify<
  // optional and readonly
  {
    readonly [K in keyof TTransformedToKey as TTransformedToKey[K] extends TOptionalKeys
      ? AtLeastOneReadonly<TTransformedToKey[K], TReadonlyKeys> extends true
        ? K
        : never
      : never]?: TInput[TTransformedToKey[K]];
  } & {
    // only optional
    [K in keyof TTransformedToKey as TTransformedToKey[K] extends TOptionalKeys
      ? AtLeastOneReadonly<TTransformedToKey[K], TReadonlyKeys> extends true
        ? never
        : K
      : never]?: TInput[TTransformedToKey[K]];
  } & Required<{
      // only readonly
      readonly [K in keyof TTransformedToKey as AtLeastOneReadonly<
        TTransformedToKey[K],
        TReadonlyKeys
      > extends true
        ? TTransformedToKey[K] extends TOptionalKeys
          ? never
          : K
        : never]?: TInput[TTransformedToKey[K]];
    }> &
    Required<{
      // strictly not optional or readonly
      [K in keyof TTransformedToKey as AtLeastOneReadonly<
        TTransformedToKey[K],
        TReadonlyKeys
      > extends true
        ? never
        : TTransformedToKey[K] extends TOptionalKeys
          ? never
          : K]?: TInput[TTransformedToKey[K]];
    }> & {
      // rest of non-string
      [K in keyof TInput as K extends string ? never : K]: TInput[K];
    }
>;

/**
 * Get transformed to key type.
 */
type GetTransformedToKey<
  TInput extends ObjectInput,
  TSelectedKeys extends StringKeyOf<TInput>,
  TKeyToTransformed extends Record<StringKeyOf<TInput>, string>,
  TIsSelectedKeysNever extends boolean = IsNever<TSelectedKeys>,
> = {
  -readonly [K in keyof TInput as K extends string
    ? TIsSelectedKeysNever extends true
      ? K
      : K extends TSelectedKeys
        ? K extends keyof TKeyToTransformed
          ? TKeyToTransformed[K]
          : K
        : K
    : never]-?: K extends string ? K : never;
};
