import type { BaseIssue, BaseSchema, ErrorMessage } from '../../types/index.ts';
import { _schemaDataset } from '../../utils/index.ts';

/**
 * Null issue type.
 */
export interface NullIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'null';
  /**
   * The expected input.
   */
  readonly expected: 'null';
}

/**
 * Null schema type.
 */
export interface NullSchema<
  TMessage extends ErrorMessage<NullIssue> | undefined,
> extends BaseSchema<null, null, NullIssue> {
  /**
   * The schema type.
   */
  readonly type: 'null';
  /**
   * The expected property.
   */
  readonly expects: 'null';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a null schema.
 *
 * @returns A null schema.
 */
export function null_(): NullSchema<undefined>;

/**
 * Creates a null schema.
 *
 * @param message The error message.
 *
 * @returns A null schema.
 */
export function null_<
  const TMessage extends ErrorMessage<NullIssue> | undefined,
>(message: TMessage): NullSchema<TMessage>;

export function null_(
  message?: ErrorMessage<NullIssue>
): NullSchema<ErrorMessage<NullIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'null',
    expects: 'null',
    async: false,
    message,
    _run(dataset, config) {
      return _schemaDataset(
        this,
        null_,
        dataset.value === null,
        dataset,
        config
      );
    },
  };
}
