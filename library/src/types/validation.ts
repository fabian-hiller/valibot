import type { Config } from './config.ts';
import type { Dataset } from './dataset.ts';
import type { BaseIssue } from './issue.ts';

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
  readonly reference: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => BaseValidation<any, any, BaseIssue<unknown>>;
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
  readonly _run: (
    dataset: Dataset<TInput, BaseIssue<unknown>>,
    config: Config<TIssue>
  ) => Dataset<TOutput, BaseIssue<unknown> | TIssue>;
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
  readonly reference: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | BaseValidation<any, any, BaseIssue<unknown>>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | BaseValidationAsync<any, any, BaseIssue<unknown>>;
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
  readonly _run: (
    dataset: Dataset<TInput, BaseIssue<unknown>>,
    config: Config<TIssue>
  ) => Promise<Dataset<TOutput, BaseIssue<unknown> | TIssue>>;
}

/**
 * Generic validation type.
 */
export interface GenericValidation<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TInput = any,
  TOutput = TInput,
  TIssue extends BaseIssue<unknown> = BaseIssue<unknown>,
> extends BaseValidation<TInput, TOutput, TIssue> {}

/**
 * Generic validation async type.
 */
export interface GenericValidationAsync<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TInput = any,
  TOutput = TInput,
  TIssue extends BaseIssue<unknown> = BaseIssue<unknown>,
> extends BaseValidationAsync<TInput, TOutput, TIssue> {}
