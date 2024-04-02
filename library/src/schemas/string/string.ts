import type { BaseIssue, BaseSchema, ErrorMessage } from '../../types/index.ts';
import { _schemaDataset } from '../../utils/index.ts';

/**
 * String issue type.
 */
export interface StringIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'string';
  /**
   * The expected input.
   */
  readonly expected: 'string';
}

/**
 * String schema type.
 */
export interface StringSchema<
  TMessage extends ErrorMessage<StringIssue> | undefined,
> extends BaseSchema<string, string, StringIssue> {
  /**
   * The schema type.
   */
  readonly type: 'string';
  /**
   * The expected property.
   */
  readonly expects: 'string';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a string schema.
 *
 * @returns A string schema.
 */
export function string(): StringSchema<undefined>;

/**
 * Creates a string schema.
 *
 * @param message The error message.
 *
 * @returns A string schema.
 */
export function string<
  const TMessage extends ErrorMessage<StringIssue> | undefined,
>(message: TMessage): StringSchema<TMessage>;

export function string(
  message?: ErrorMessage<StringIssue>
): StringSchema<ErrorMessage<StringIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'string',
    expects: 'string',
    async: false,
    message,
    _run(dataset, config) {
      return _schemaDataset(
        this,
        string,
        typeof dataset.value === 'string',
        dataset,
        config
      );
    },
  };
}
