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
