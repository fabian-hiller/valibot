import type { Config } from './config';
import type { Dataset } from './dataset';
import type { BaseIssue } from './issue';

/**
 * Base validation type.
 */
export interface BaseValidation<
  TInput,
  TOutput,
  TIssue extends BaseIssue<unknown>,
> {
  /**
   * The object kind.
   */
  readonly kind: 'validation';
  /**
   * The validation type.
   */
  readonly type: string;
  /**
   * The expected property.
   */
  readonly expects: string | null;
  /**
   * Whether it's async.
   */
  readonly async: false;
  /**
   * Validates known input.
   *
   * @param dataset The input dataset.
   * @param config The configuration.
   *
   * @returns The output dataset.
   *
   * @internal
   */
  _run(
    dataset: Dataset<TInput, BaseIssue<TInput>>,
    config: Config<TIssue>
  ): Dataset<TOutput, BaseIssue<TInput> | TIssue>;
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
 * Base validation async type.
 */
export interface BaseValidationAsync<
  TInput,
  TOutput,
  TIssue extends BaseIssue<unknown>,
> extends Omit<BaseValidation<TInput, TOutput, TIssue>, 'async' | '_run'> {
  /**
   * Whether it's async.
   */
  readonly async: true;
  /**
   * Validates known input.
   *
   * @param dataset The input dataset.
   * @param config The configuration.
   *
   * @returns The output dataset.
   *
   * @internal
   */
  _run(
    dataset: Dataset<TInput, BaseIssue<TInput>>,
    config: Config<TIssue>
  ): Promise<Dataset<TOutput, BaseIssue<TInput> | TIssue>>;
}
