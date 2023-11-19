import type { Issue, Issues } from './issues.ts';

/**
 * Parse info type.
 */
export type ParseInfo = Partial<
  Pick<Issue, 'origin' | 'abortEarly' | 'abortPipeEarly' | 'skipPipe'>
>;

/**
 * Parse result type.
 */
export type _ParseResult<TOutput> =
  | {
      /**
       * The parse output.
       */
      output: TOutput;
      /**
       * The parse issues.
       */
      issues?: undefined;
    }
  | {
      /**
       * The parse output.
       */
      output?: undefined;
      /**
       * The parse issues.
       */
      issues: Issues;
    };

/**
 * Base schema type.
 */
export type BaseSchema<TInput = any, TOutput = TInput> = {
  /**
   * Whether it's async.
   */
  async: false;
  /**
   * Parses unknown input based on its schema.
   *
   * @internal This is an internal API.
   *
   * @param input The input to be parsed.
   * @param info The parse info.
   *
   * @returns The parse result.
   */
  _parse(input: unknown, info?: ParseInfo): _ParseResult<TOutput>;
  /**
   * Input and output type.
   *
   * @internal This is an internal API.
   */
  _types?: { input: TInput; output: TOutput };
};

/**
 * Base schema async type.
 */
export type BaseSchemaAsync<TInput = any, TOutput = TInput> = {
  /**
   * Whether it's async.
   */
  async: true;
  /**
   * Parses unknown input based on its schema.
   *
   * @internal This is an internal API.
   *
   * @param input The input to be parsed.
   * @param info The parse info.
   *
   * @returns The parse result.
   */
  _parse(input: unknown, info?: ParseInfo): Promise<_ParseResult<TOutput>>;
  /**
   * Input and output type.
   *
   * @internal This is an internal API.
   */
  _types?: { input: TInput; output: TOutput };
};

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
