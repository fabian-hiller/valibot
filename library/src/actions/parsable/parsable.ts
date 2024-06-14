import { parse } from '../../methods/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  InferInput,
  InferOutput,
} from '../../types';
import type { BaseMetadata } from '../../types/metadata';

/**
 * Parsable action type.
 */
export interface ParsableAction<TInput> extends BaseMetadata<TInput> {
  /**
   * The metadata type.
   */
  readonly type: 'parsable';
  /**
   * The metadata reference.
   */
  readonly reference: typeof parsable;

  readonly extraProperties: {
    parse<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
      this: TSchema,
      input: InferInput<TSchema>
    ): InferOutput<TSchema>;
  };
}

/**
 * Parsable metadata type.
 *
 * @returns A parsable action.
 */
export function parsable<TInput>(): ParsableAction<TInput> {
  return {
    kind: 'metadata',
    type: 'parsable',
    reference: parsable,
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
