import { ISO_DATE_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * ISO date issue type.
 */
export interface IsoDateIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'iso_date';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The ISO date regex.
   */
  readonly requirement: RegExp;
}

/**
 * ISO date action type.
 */
export interface IsoDateAction<
  TInput extends string,
  TMessage extends ErrorMessage<IsoDateIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, IsoDateIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'iso_date';
  /**
   * The action reference.
   */
  readonly reference: typeof isoDate;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The ISO date regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [ISO date](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: yyyy-mm-dd
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31" is valid although June has only
 * 30 days.
 *
 * @returns An ISO date action.
 */
export function isoDate<TInput extends string>(): IsoDateAction<
  TInput,
  undefined
>;

/**
 * Creates an [ISO date](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: yyyy-mm-dd
 *
 * Hint: The regex used cannot validate the maximum number of days based on
 * year and month. For example, "2023-06-31" is valid although June has only
 * 30 days.
 *
 * @param message The error message.
 *
 * @returns An ISO date action.
 */
export function isoDate<
  TInput extends string,
  const TMessage extends ErrorMessage<IsoDateIssue<TInput>> | undefined,
>(message: TMessage): IsoDateAction<TInput, TMessage>;

// @__NO_SIDE_EFFECTS__
export function isoDate(
  message?: ErrorMessage<IsoDateIssue<string>>
): IsoDateAction<string, ErrorMessage<IsoDateIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'iso_date',
    reference: isoDate,
    async: false,
    expects: null,
    requirement: ISO_DATE_REGEX,
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'date', dataset, config);
      }
      return dataset;
    },
  };
}
