import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Number issue type.
 */
export interface NumberIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'number';
  /**
   * The expected property.
   */
  readonly expected: 'number';
}

/**
 * Number schema type.
 */
export interface NumberSchema<
  TMessage extends ErrorMessage<NumberIssue> | undefined,
> extends BaseSchema<number, number, NumberIssue> {
  /**
   * The schema type.
   */
  readonly type: 'number';
  /**
   * The schema reference.
   */
  readonly reference: typeof number;
  /**
   * The expected property.
   */
  readonly expects: 'number';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a number schema.
 *
 * @returns A number schema.
 */
export function number(): NumberSchema<undefined>;

/**
 * Creates a number schema.
 *
 * @param message The error message.
 *
 * @returns A number schema.
 */
export function number<
  const TMessage extends ErrorMessage<NumberIssue> | undefined,
>(message: TMessage): NumberSchema<TMessage>;

export function number(
  message?: ErrorMessage<NumberIssue>
): NumberSchema<ErrorMessage<NumberIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'number',
    reference: number,
    expects: 'number',
    async: false,
    message,
    '~standard': 1,
    '~vendor': 'valibot',
    '~validate'(dataset, config = getGlobalConfig()) {
      if (typeof dataset.value === 'number' && !isNaN(dataset.value)) {
        // @ts-expect-error
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      return dataset as unknown as OutputDataset<number, NumberIssue>;
    },
  };
}
