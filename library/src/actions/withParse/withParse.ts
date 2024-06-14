import { parse } from '../../methods/index.ts';
import type {
  BaseIssue,
  BaseMetadata,
  BaseSchema,
  Config,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';

/**
 * WithParse metadata type.
 */
export interface WithParseMetadata<TInput> extends BaseMetadata<TInput> {
  /**
   * The metadata type.
   */
  readonly type: 'with_parse';
  /**
   * The metadata reference.
   */
  readonly reference: typeof withParse;

  readonly extraProperties: {
    /**
     * Parses an unknown input based on a schema.
     *
     * @param schema The schema to be used.
     * @param input The input to be parsed.
     * @param config The parse configuration.
     *
     * @returns The parsed input.
     */
    parse<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
      this: TSchema,
      input: unknown,
      config?: Config<InferIssue<TSchema>>
    ): InferOutput<TSchema>;
  };
}

/**
 * Creates a with-parse metadata.
 *
 * @returns A WithParse metadata.
 */
export function withParse<TInput>(): WithParseMetadata<TInput> {
  return {
    kind: 'metadata',
    type: 'with_parse',
    reference: withParse,
    extraProperties: {
      parse: _parse,
    },
  };
}

function _parse<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(
  this: TSchema,
  input: unknown,
  config?: Config<InferIssue<TSchema>>
): InferOutput<TSchema> {
  return parse(this, input, config);
}
