import type { SchemaConfig } from './config.ts';
import type { SchemaIssues } from './issues.ts';

/**
 * Typed schema result type.
 */
export interface TypedSchemaResult<TOutput> {
  /**
   * Whether is's typed.
   */
  typed: true;
  /**
   * The parse output.
   */
  output: TOutput;
  /**
   * The parse issues.
   */
  issues?: SchemaIssues;
}

/**
 * Untyped schema result type.
 */
export interface UntypedSchemaResult {
  /**
   * Whether is's typed.
   */
  typed: false;
  /**
   * The parse output.
   */
  output: unknown;
  /**
   * The parse issues.
   */
  issues: SchemaIssues;
}

/**
 * Schema result type.
 */
export type SchemaResult<TOutput> =
  | TypedSchemaResult<TOutput>
  | UntypedSchemaResult;

export interface BaseSchema<TInput = any, TOutput = TInput> {
  /**
   * The expected property.
   */
  expects: string;
  /**
   * Whether it's async.
   */
  async: false;
  /**
   * Parses unknown input based on its schema.
   *
   * @param input The input to be parsed.
   * @param config The parse configuration.
   *
   * @returns The schema result.
   *
   * @internal
   */
  _parse(input: unknown, config?: SchemaConfig): SchemaResult<TOutput>;
  /**
   * Input and output type.
   *
   * @internal
   */
  _types?: { input: TInput; output: TOutput };
}

/**
 * Base schema async type.
 */
export interface BaseSchemaAsync<TInput = any, TOutput = TInput> {
  /**
   * The expected property.
   */
  expects: string;
  /**
   * Whether it's async.
   */
  async: true;
  /**
   * Parses unknown input based on its schema.
   *
   * @param input The input to be parsed.
   * @param config The parse configuration.
   *
   * @returns The schema result.
   *
   * @internal
   */
  _parse(input: unknown, config?: SchemaConfig): Promise<SchemaResult<TOutput>>;
  /**
   * Input and output type.
   *
   * @internal
   */
  _types?: { input: TInput; output: TOutput };
}

/**
 * Input inference type.
 */
export type Input<TSchema extends BaseSchema | BaseSchemaAsync> = NonNullable<
  TSchema['_types']
>['input'];

/**
 * Output inference type.
 */
export type Output<TSchema extends BaseSchema | BaseSchemaAsync> = NonNullable<
  TSchema['_types']
>['output'];
