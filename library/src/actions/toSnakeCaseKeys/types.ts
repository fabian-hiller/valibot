import type {
  IsEmpty,
  IsSeparator,
  IsUpperCase,
  IsWordStart,
  WasPrevUpperCase,
} from '../../utils/_caseTransform/index.ts';
import type {
  ObjectInput,
  SelectedStringKeys,
  TransformedKeysObject,
} from '../types.ts';

/**
 * Output type.
 */
export type Output<
  TInput extends ObjectInput,
  TSelectedKeys extends SelectedStringKeys<TInput> | undefined,
> = TransformedKeysObject<
  TInput,
  TSelectedKeys,
  {
    [K in keyof TInput]: K extends string ? ToSnakeCase<K> : never;
  }
>;

/**
 * To snake case type.
 */
export type ToSnakeCase<TInput extends string> = ToSnakeCaseHelper<TInput>;

/**
 * To snake case helper type.
 */
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
