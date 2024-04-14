import type { BaseIssue, BaseSchema, ErrorMessage } from '../../types/index.ts';
import { _schemaDataset } from '../../utils/index.ts';

/**
 * Undefined issue type.
 */
export interface UndefinedIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'undefined';
  /**
   * The expected input.
   */
  readonly expected: 'undefined';
}

/**
 * Undefined schema type.
 */
export interface UndefinedSchema<
  TMessage extends ErrorMessage<UndefinedIssue> | undefined,
> extends BaseSchema<undefined, undefined, UndefinedIssue> {
  /**
   * The schema type.
   */
  readonly type: 'undefined';
  /**
   * The expected property.
   */
  readonly expects: 'undefined';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an undefined schema.
 *
 * @returns An undefined schema.
 */
export function undefined_(): UndefinedSchema<undefined>;

/**
 * Creates an undefined schema.
 *
 * @param message The error message.
 *
 * @returns An undefined schema.
 */
export function undefined_<
  const TMessage extends ErrorMessage<UndefinedIssue> | undefined,
>(message: TMessage): UndefinedSchema<TMessage>;

export function undefined_(
  message?: ErrorMessage<UndefinedIssue>
): UndefinedSchema<ErrorMessage<UndefinedIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'undefined',
    expects: 'undefined',
    async: false,
    message,
    _run(dataset, config) {
      return _schemaDataset(
        this,
        undefined_,
        dataset.value === undefined,
        dataset,
        config
      );
    },
  };
}
