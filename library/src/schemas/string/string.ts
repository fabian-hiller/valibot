import type {
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue, _getStandardProps } from '../../utils/index.ts';

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
   * The expected property.
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
   * The schema reference.
   */
  readonly reference: typeof string;
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
    reference: string,
    expects: 'string',
    async: false,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (typeof dataset.value === 'string') {
        // @ts-expect-error
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      // @ts-expect-error
      return dataset as OutputDataset<string, StringIssue>;
    },
  };
}
