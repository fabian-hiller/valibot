import type { Issue } from './issues.ts';
import type { ErrorMessage } from './other.ts';
import type { ParseInfo } from './schema.ts';

/**
 * Pipe info type.
 */
export type PipeInfo = ParseInfo & Pick<Issue, 'reason'>;

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
  issues: Pick<Issue, 'validation' | 'message' | 'input' | 'requirement'>[];
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
   * Whether it's async.
   */
  async: false;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * Parses unknown input based on its requirement.
   *
   * @param input The input to be parsed.
   *
   * @returns The parse result.
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
   * Whether it's async.
   */
  async: true;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * Parses unknown input based on its requirement.
   *
   * @param input The input to be parsed.
   *
   * @returns The parse result.
   *
   * @internal
   */
  _parse(input: TInput): Promise<PipeActionResult<TInput>>;
};

/**
 * Base transformation type.
 */
export type BaseTransformation<TInput = any> = {
  /**
   * Whether it's async.
   */
  async: false;
  /**
   * Parses unknown input based on its requirement.
   *
   * @param input The input to be parsed.
   *
   * @returns The parse result.
   *
   * @internal
   */
  _parse(input: TInput): PipeActionResult<TInput>;
};

/**
 * Base transformation async type.
 */
export type BaseTransformationAsync<TInput = any> = {
  /**
   * Whether it's async.
   */
  async: true;
  /**
   * Parses unknown input based on its requirement.
   *
   * @param input The input to be parsed.
   *
   * @returns The parse result.
   *
   * @internal
   */
  _parse(input: TInput): Promise<PipeActionResult<TInput>>;
};

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
