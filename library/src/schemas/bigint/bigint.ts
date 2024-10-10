import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Bigint issue type.
 */
export interface BigintIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'bigint';
  /**
   * The expected property.
   */
  readonly expected: 'bigint';
}

/**
 * Bigint schema type.
 */
export interface BigintSchema<
  TMessage extends ErrorMessage<BigintIssue> | undefined,
> extends BaseSchema<bigint, bigint, BigintIssue> {
  /**
   * The schema type.
   */
  readonly type: 'bigint';
  /**
   * The schema reference.
   */
  readonly reference: typeof bigint;
  /**
   * The expected property.
   */
  readonly expects: 'bigint';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a bigint schema.
 *
 * @returns A bigint schema.
 */
export function bigint(): BigintSchema<undefined>;

/**
 * Creates a bigint schema.
 *
 * @param message The error message.
 *
 * @returns A bigint schema.
 */
export function bigint<
  const TMessage extends ErrorMessage<BigintIssue> | undefined,
>(message: TMessage): BigintSchema<TMessage>;

export function bigint(
  message?: ErrorMessage<BigintIssue>
): BigintSchema<ErrorMessage<BigintIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'bigint',
    reference: bigint,
    expects: 'bigint',
    async: false,
    message,
    '~standard': 1,
    '~vendor': 'valibot',
    '~validate'(dataset, config = getGlobalConfig()) {
      if (typeof dataset.value === 'bigint') {
        // @ts-expect-error
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      // @ts-expect-error
      return dataset as OutputDataset<bigint, BigintIssue>;
    },
  };
}
