import type {
  ObjectInput,
  SelectedStringKeys,
  TransformedObjectOutput,
} from '../types.ts';

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
    [K in keyof TInput]: K extends string ? ToSnakeCase<K> : never;
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

type SnakeCaseSeparator = '_';

type Separator = Whitespace | SnakeCaseSeparator | '-' | '.';

type IsSeparator<T extends string> = T extends Separator ? true : false;

type IsUpperCase<T extends string> =
  T extends Uppercase<T> ? (T extends Lowercase<T> ? false : true) : false;

type IsEmpty<T extends string> = T extends '' ? true : false;

type TrimStart<T extends string> = T extends `${Whitespace}${infer TRemaining}`
  ? TrimStart<TRemaining>
  : T;

/**
 * To snake case type.
 */
export type ToSnakeCase<T extends string> = ToSnakeCaseHelper<TrimStart<T>>;

type ToSnakeCaseHelper<
  T extends string,
  TResult extends string = '',
  TWasLastAddedSeparator extends boolean = false,
  TWasPrevChUpperCase extends boolean = false,
> = T extends `${infer TCh}${infer TRemaining}`
  ? IsSeparator<TCh> extends true
    ? IsEmpty<TResult> extends false
      ? TWasLastAddedSeparator extends false
        ? ToSnakeCaseHelper<
            TRemaining,
            `${TResult}${SnakeCaseSeparator}`,
            true,
            false
          >
        : ToSnakeCaseHelper<TRemaining, TResult, TWasLastAddedSeparator, false>
      : ToSnakeCaseHelper<TRemaining, TResult, TWasLastAddedSeparator, false>
    : IsUpperCase<TCh> extends true
      ? ToSnakeCaseHelper<
          TRemaining,
          `${TResult}${IsEmpty<TResult> extends false
            ? TWasLastAddedSeparator extends false
              ? TWasPrevChUpperCase extends false
                ? SnakeCaseSeparator
                : ''
              : ''
            : ''}${Lowercase<TCh>}`,
          false,
          true
        >
      : ToSnakeCaseHelper<TRemaining, `${TResult}${TCh}`, false, false>
  : TResult extends `${infer TRest extends string}${SnakeCaseSeparator}`
    ? TRest
    : TResult;
