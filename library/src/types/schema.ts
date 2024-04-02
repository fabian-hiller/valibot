import type { Config } from './config.ts';
import type { Dataset } from './dataset.ts';
import type { BaseIssue } from './issue.ts';

/**
 * Base schema type.
 */
export interface BaseSchema<
  TInput,
  TOutput,
  TIssue extends BaseIssue<unknown>,
> {
  /**
   * The object kind.
   */
  readonly kind: 'schema';
  /**
   * The schema type.
   */
  readonly type: string;
  /**
   * The expected property.
   */
  readonly expects: string;
  /**
   * Whether it's async.
   */
  readonly async: false;
  /**
   * Parses unknown input.
   *
   * @param dataset The input dataset.
   * @param config The configuration.
   *
   * @returns The output dataset.
   *
   * @internal
   */
  _run(
    dataset: Dataset<unknown, never>,
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
 * Base schema async type.
 */
export interface BaseSchemaAsync<
  TInput,
  TOutput,
  TIssue extends BaseIssue<unknown>,
> extends Omit<BaseSchema<TInput, TOutput, TIssue>, 'async' | '_run'> {
  /**
   * Whether it's async.
   */
  readonly async: true;
  /**
   * Parses unknown input.
   *
   * @param dataset The input dataset.
   * @param config The configuration.
   *
   * @returns The output dataset.
   *
   * @internal
   */
  _run(
    dataset: Dataset<unknown, never>,
    config: Config<TIssue>
  ): Promise<Dataset<TOutput, TIssue>>;
}
