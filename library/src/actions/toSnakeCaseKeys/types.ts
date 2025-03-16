import type { whitespaces } from '../toSnakeCase/helpers.ts';
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

type Whitespace = (typeof whitespaces)[number];

type Separator = Whitespace | '_' | '-' | '.';

type IsSeparator<T extends string> = T extends Separator ? true : false;

type IsUpperCase<T extends string> =
  T extends Uppercase<T> ? (T extends Lowercase<T> ? false : true) : false;

type IsEmpty<T extends string> = T extends '' ? true : false;

type IsWordStart<TPrevCh extends string | null> = [TPrevCh] extends [string]
  ? IsSeparator<TPrevCh>
  : true;

type WasPrevUpperCase<TPrevCh extends string | null> = [TPrevCh] extends [
  string,
]
  ? IsUpperCase<TPrevCh>
  : false;

type ToSnakeCaseHelper<
  TInput extends string,
  TPrevCh extends string | null = null,
  TResult extends string = '',
> = TInput extends `${infer TCh}${infer TRest}`
  ? IsSeparator<TCh> extends false
    ? IsWordStart<TPrevCh> extends true
      ? ToSnakeCaseHelper<
          TRest,
          TCh,
          `${TResult}${IsEmpty<TResult> extends true ? '' : '_'}${Lowercase<TCh>}`
        >
      : IsUpperCase<TCh> extends true
        ? ToSnakeCaseHelper<
            TRest,
            TCh,
            `${TResult}${WasPrevUpperCase<TPrevCh> extends true ? '' : '_'}${Lowercase<TCh>}`
          >
        : ToSnakeCaseHelper<TRest, TCh, `${TResult}${TCh}`>
    : ToSnakeCaseHelper<TRest, TCh, TResult>
  : TResult;

/**
 * To snake case type.
 */
export type ToSnakeCase<TInput extends string> = ToSnakeCaseHelper<TInput>;
