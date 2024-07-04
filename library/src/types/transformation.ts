import type { Config } from './config.ts';
import type { Dataset, TypedDataset } from './dataset.ts';
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
   * The transformation reference.
   */
  readonly reference: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => BaseTransformation<unknown, unknown, BaseIssue<unknown>>;
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
  ): Dataset<TOutput, TIssue>;
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
> extends Omit<
    BaseTransformation<TInput, TOutput, TIssue>,
    'reference' | 'async' | '_run'
  > {
  /**
   * The transformation reference.
   */
  readonly reference: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) =>
    | BaseTransformation<unknown, unknown, BaseIssue<unknown>>
    | BaseTransformationAsync<unknown, unknown, BaseIssue<unknown>>;
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
  ): Promise<Dataset<TOutput, TIssue>>;
}

/**
 * Generic transformation type.
 */
export interface GenericTransformation<
  TInput = unknown,
  TOutput = TInput,
  TIssue extends BaseIssue<unknown> = BaseIssue<unknown>,
> extends BaseTransformation<TInput, TOutput, TIssue> {}

/**
 * Generic transformation async type.
 */
export interface GenericTransformationAsync<
  TInput = unknown,
  TOutput = TInput,
  TIssue extends BaseIssue<unknown> = BaseIssue<unknown>,
> extends BaseTransformationAsync<TInput, TOutput, TIssue> {}
