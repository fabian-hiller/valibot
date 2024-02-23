import type { ErrorMessage } from './config.ts';
import type { PipeActionIssues } from './issues.ts';

/**
 * Pipe action context type.
 */
export type PipeActionContext = {
  type: string;
  expects: string | null;
  message: ErrorMessage | undefined;
  requirement: unknown;
};

/**
 * Valid action result type.
 */
export type ValidActionResult<TOutput> = {
  /**
   * The pipe output.
   */
  output: TOutput;
  /**
   * The pipe issues.
   */
  issues?: undefined;
};

/**
 * Invalid action result type.
 */
export type InvalidActionResult = {
  /**
   * The pipe output.
   */
  output?: undefined;
  /**
   * The pipe issues.
   */
  issues: PipeActionIssues;
};

/**
 * Pipe action result type.
 */
export type PipeActionResult<TOutput> =
  | ValidActionResult<TOutput>
  | InvalidActionResult;

/**
 * Base validation type.
 */
export type BaseValidation<TInput = any> = {
  /**
   * The expected property.
   */
  expects: string | null;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * Whether it's async.
   */
  async: false;
  /**
   * Parses unknown input based on its requirement.
   *
   * @param input The input to be parsed.
   *
   * @returns The pipe action result.
   *
   * @internal
   */
  _parse(input: TInput): PipeActionResult<TInput>;
};

/**
 * Base validation async type.
 */
export type BaseValidationAsync<TInput = any> = {
  /**
   * The expected property.
   */
  expects: string | null;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * Whether it's async.
   */
  async: true;
  /**
   * Parses unknown input based on its requirement.
   *
   * @param input The input to be parsed.
   *
   * @returns The pipe action result.
   *
   * @internal
   */
  _parse(input: TInput): Promise<PipeActionResult<TInput>>;
};

/**
 * Base transformation type.
 */
export interface BaseTransformation<TInput = any> {
  /**
   * Whether it's async.
   */
  async: false;
  /**
   * Parses unknown input based on its requirement.
   *
   * @param input The input to be parsed.
   *
   * @returns The pipe action result.
   *
   * @internal
   */
  _parse(input: TInput): PipeActionResult<TInput>;
}

/**
 * Base transformation async type.
 */
export interface BaseTransformationAsync<TInput = any> {
  /**
   * Whether it's async.
   */
  async: true;
  /**
   * Parses unknown input based on its requirement.
   *
   * @param input The input to be parsed.
   *
   * @returns The pipe action result.
   *
   * @internal
   */
  _parse(input: TInput): Promise<PipeActionResult<TInput>>;
}

/**
 * Pipe type.
 */
export type Pipe<TInput> = (
  | BaseValidation<TInput>
  | BaseTransformation<TInput>
)[];

/**
 * Pipe async type.
 */
export type PipeAsync<TInput> = (
  | BaseValidation<TInput>
  | BaseValidationAsync<TInput>
  | BaseTransformation<TInput>
  | BaseTransformationAsync<TInput>
)[];
