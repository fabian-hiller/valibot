import { parse, parseAsync } from '../../methods/index.ts';
import type {
  BaseIssue,
  BaseMetadata,
  BaseSchema,
  BaseSchemaAsync,
  Config,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';

/**
 * AsParser metadata type.
 */
export interface AsParserMetadata<TInput> extends BaseMetadata<TInput> {
  /**
   * The metadata type.
   */
  readonly type: 'as_parser';
  /**
   * The metadata reference.
   */
  readonly reference: typeof asParser;

  readonly extraProperties: {
    /**
     * Parses an unknown input based on a schema.
     *
     * @param this The schema to be used.
     * @param input The input to be parsed.
     * @param config The parse configuration.
     *
     * @returns The parsed input.
     */
    parse<
      TSchema extends
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
    >(
      this: TSchema,
      input: unknown,
      config?: Config<InferIssue<TSchema>>
    ): TSchema extends BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
      ? Promise<InferOutput<TSchema>>
      : InferOutput<TSchema>;
  };
}

/**
 * Creates a asParser metadata.
 *
 * @returns A asParser metadata.
 */
export function asParser<TInput>(): AsParserMetadata<TInput> {
  return {
    kind: 'metadata',
    type: 'as_parser',
    reference: asParser,
    extraProperties: {
      parse: _parse as AsParserMetadata<TInput>['extraProperties']['parse'],
    },
  };
}

function _parse(
  this:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  input: unknown,
  config?: Config<BaseIssue<unknown>>
) {
  if (this.async === false) {
    return parse(this, input, config);
  }
  return parseAsync(this, input, config);
}
