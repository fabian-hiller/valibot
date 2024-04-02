import type { Config } from './config.ts';
import type { TypedDataset } from './dataset.ts';
import type { BaseIssue } from './issue.ts';

/**
 * Base transformation type.
 */
export interface BaseTransformation<
  TInput,
  TOutput,
  TIssue extends BaseIssue<unknown>,
> {
  /**
   * The object kind.
   */
  readonly kind: 'transformation';
  /**
   * The transformation type.
   */
  readonly type: string;
  /**
   * Whether it's async.
   */
  readonly async: false;
  /**
   * Transforms known input.
   *
   * @param dataset The input dataset.
   * @param config The configuration.
   *
   * @returns The output dataset.
   *
   * @internal
   */
  _run(
    dataset: TypedDataset<TInput, never>,
    config: Config<TIssue>
  ): TypedDataset<TOutput, TIssue>;
  /**
   * Input, output and issue type.
   *
   * @internal
   */
  readonly _types?: {
    readonly input: TInput;
    readonly output: TOutput;
    readonly issue: TIssue;
  };
}

/**
 * Base transformation async type.
 */
export interface BaseTransformationAsync<
  TInput,
  TOutput,
  TIssue extends BaseIssue<unknown>,
> extends Omit<BaseTransformation<TInput, TOutput, TIssue>, 'async' | '_run'> {
  /**
   * Whether it's async.
   */
  readonly async: true;
  /**
   * Transforms known input.
   *
   * @param dataset The input dataset.
   * @param config The configuration.
   *
   * @returns The output dataset.
   *
   * @internal
   */
  _run(
    dataset: TypedDataset<TInput, never>,
    config: Config<TIssue>
  ): Promise<TypedDataset<TOutput, TIssue>>;
}
