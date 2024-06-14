import { parse } from '../../methods/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  InferInput,
  InferOutput,
} from '../../types/index.ts';
import type { BaseMetadata } from '../../types/metadata.ts';

/**
 * WithParse metadata type.
 */
export interface WithParseAction<TInput> extends BaseMetadata<TInput> {
  /**
   * The metadata type.
   */
  readonly type: 'withParse';
  /**
   * The metadata reference.
   */
  readonly reference: typeof withParse;

  readonly extraProperties: {
    parse<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
      this: TSchema,
      input: InferInput<TSchema>
    ): InferOutput<TSchema>;
  };
}

/**
 * Creates a with parse metadata.
 *
 * @returns A WithParse metadata.
 */
export function withParse<TInput>(): WithParseAction<TInput> {
  return {
    kind: 'metadata',
    type: 'withParse',
    reference: withParse,
    extraProperties: {
      parse: _parse,
    },
  };
}

function _parse<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(this: TSchema, input: InferInput<TSchema>): InferOutput<TSchema> {
  return parse(this, input);
}
