import type { Config } from './config.ts';
import type { Dataset } from './dataset.ts';
import type { BaseIssue } from './issue.ts';
import type { FunctionReference } from './other.ts';

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
   * The validation reference.
   */
  readonly reference: FunctionReference<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any[],
    BaseValidation<unknown, unknown, BaseIssue<unknown>>
  >;
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
> extends Omit<
    BaseValidation<TInput, TOutput, TIssue>,
    'reference' | 'async' | '_run'
  > {
  /**
   * The validation reference.
   */
  readonly reference: FunctionReference<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any[],
    | BaseValidation<unknown, unknown, BaseIssue<unknown>>
    | BaseValidationAsync<unknown, unknown, BaseIssue<unknown>>
  >;
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
