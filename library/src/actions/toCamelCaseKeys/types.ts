import type { IsNever } from '../../types/index.ts';

/**
 * Object input type.
 */
export type ObjectInput = Record<string | number | symbol, unknown>;

/**
 * Selected string keys type.
 */
export type SelectedStringKeys<T extends ObjectInput> = (keyof T & string)[];

type TransformedObjectOutput<
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

/**
 * Output type.
 */
export type Output<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput> | undefined,
> = TransformedObjectOutput<
  TInput,
  TSelectedKeys,
  {
    [K in keyof TInput]: K extends string ? ToCamelCase<K> : never;
  }
>;

type Whitespace =
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#white_space
  | '\t'
  | '\v'
  | '\f'
  | ' '
  | '\u00A0'
  | '\uFEFF'
  | '\u1680'
  | '\u2000'
  | '\u2001'
  | '\u2002'
  | '\u2003'
  | '\u2004'
  | '\u2005'
  | '\u2006'
  | '\u2007'
  | '\u2008'
  | '\u2009'
  | '\u200A'
  | '\u202F'
  | '\u205F'
  | '\u3000'
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#line_terminators
  | '\n'
  | '\r'
  | '\u2028'
  | '\u2029';

type Separator = Whitespace | '_' | '-' | '.';

type IsSeparator<T extends string> = T extends Separator ? true : false;

type IsUpperCase<T extends string> =
  T extends Uppercase<T> ? (T extends Lowercase<T> ? false : true) : false;

type IsEmpty<T extends string> = T extends '' ? true : false;

type ToCamelCase<T extends string> = SpaceSeparatedToCamelCase<
  ToSpaceSeparated<T>
>;

type ToSpaceSeparated<
  TInput extends string,
  TResult extends string = '',
  TResultTop extends string = '',
> = TInput extends `${infer TCh}${infer TRest}`
  ? IsSeparator<TCh> extends false
    ? ToSpaceSeparated<TRest, `${TResult}${TCh}`, TCh>
    : IsEmpty<TResult> extends false
      ? TResultTop extends ' '
        ? ToSpaceSeparated<TRest, TResult, TResultTop>
        : ToSpaceSeparated<TRest, `${TResult} `, ' '>
      : ToSpaceSeparated<TRest, TResult, TResultTop>
  : TResult extends `${infer TTrimmedResult} `
    ? TTrimmedResult
    : TResult;

type ToCamelCaseSubStrHelper<
  TInput extends string,
  TWasPrevUpperCase extends boolean,
  TResult extends string = '',
> = TInput extends `${infer TCh}${infer TRest}`
  ? ToCamelCaseSubStrHelper<
      TRest,
      IsUpperCase<TCh>,
      `${TResult}${TWasPrevUpperCase extends true ? Lowercase<TCh> : TCh}`
    >
  : TResult;

type ToCamelCaseSubStr<
  TInput extends string,
  TConvertFirstToLowerCase extends boolean,
> = TInput extends `${infer TCh}${infer TRest}`
  ? `${TConvertFirstToLowerCase extends true
      ? Lowercase<TCh>
      : Uppercase<TCh>}${ToCamelCaseSubStrHelper<TRest, IsUpperCase<TCh>>}`
  : TInput;

type SpaceSeparatedToCamelCase<
  TInput extends string,
  TResult extends string = '',
> = TInput extends `${infer TWord} ${infer TRest}`
  ? SpaceSeparatedToCamelCase<
      TRest,
      `${TResult}${ToCamelCaseSubStr<TWord, IsEmpty<TResult>>}`
    >
  : `${TResult}${ToCamelCaseSubStr<TInput, IsEmpty<TResult>>}`;
