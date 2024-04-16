import { ISO_TIMESTAMP_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

/**
 * ISO Timestamp issue type.
 */
export interface IsoTimestampIssue<TInput extends string>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'iso_timestamp';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
  /**
   * The ISO Timestamp regex.
   */
  readonly requirement: RegExp;
}

/**
 * ISO Timestamp action type.
 */
export interface IsoTimestampAction<
  TInput extends string,
  TMessage extends ErrorMessage<IsoTimestampIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, IsoTimestampIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'iso_timestamp';
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The ISO Timestamp regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [ISO Timestamp](https://en.wikipedia.org/wiki/ISO_8601) validation
 * action.
 *
 * Format: `yyyy-mm-ddThh:mm:ss.sssZ`
 *
 * Hint: To support timestamps with lower or higher accuracy, the millisecond
 * specification can be removed or contain up to 9 digits.
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, `"2023-06-31T00:00:00.000Z"` is valid although
 * June has only 30 days.
 *
 * @returns An ISO Timestamp action.
 */
export function isoTimestamp<TInput extends string>(): IsoTimestampAction<
  TInput,
  undefined
>;

/**
 * Creates a [ISO Timestamp](https://en.wikipedia.org/wiki/ISO_8601) validation
 * action.
 *
 * Format: `yyyy-mm-ddThh:mm:ss.sssZ`
 *
 * Hint: To support timestamps with lower or higher accuracy, the millisecond
 * specification can be removed or contain up to 9 digits.
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, `"2023-06-31T00:00:00.000Z"` is valid although
 * June has only 30 days.
 *
 * @param message The error message.
 *
 * @returns An ISO Timestamp action.
 */
export function isoTimestamp<
  TInput extends string,
  const TMessage extends ErrorMessage<IsoTimestampIssue<TInput>> | undefined,
>(message: TMessage): IsoTimestampAction<TInput, TMessage>;

export function isoTimestamp(
  message?: ErrorMessage<IsoTimestampIssue<string>>
): IsoTimestampAction<
  string,
  ErrorMessage<IsoTimestampIssue<string>> | undefined
> {
  return {
    kind: 'validation',
    type: 'iso_timestamp',
    async: false,
    expects: null,
    requirement: ISO_TIMESTAMP_REGEX,
    message,
    _run(dataset, config) {
      return _validationDataset(
        this,
        isoTimestamp,
        'ISO Timestamp',
        dataset.typed && !this.requirement.test(dataset.value),
        dataset,
        config
      );
    },
  };
}
