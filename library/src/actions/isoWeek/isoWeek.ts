import { ISO_WEEK_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * ISO week issue interface.
 */
export interface IsoWeekIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'iso_week';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The ISO week regex.
   */
  readonly requirement: RegExp;
}

/**
 * ISO week action interface.
 */
export interface IsoWeekAction<
  TInput extends string,
  TMessage extends ErrorMessage<IsoWeekIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, IsoWeekIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'iso_week';
  /**
   * The action reference.
   */
  readonly reference: typeof isoWeek;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The ISO week regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [ISO week](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: yyyy-Www
 *
 * Hint: The regex used cannot validate the maximum number of weeks based on
 * the year. For example, "2021W53" is valid although 2021 has only 52 weeks.
 *
 * @returns An ISO week action.
 */
export function isoWeek<TInput extends string>(): IsoWeekAction<
  TInput,
  undefined
>;

/**
 * Creates an [ISO week](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: yyyy-Www
 *
 * Hint: The regex used cannot validate the maximum number of weeks based on
 * the year. For example, "2021W53" is valid although 2021 has only 52 weeks.
 *
 * @param message The error message.
 *
 * @returns An ISO week action.
 */
export function isoWeek<
  TInput extends string,
  const TMessage extends ErrorMessage<IsoWeekIssue<TInput>> | undefined,
>(message: TMessage): IsoWeekAction<TInput, TMessage>;

// @__NO_SIDE_EFFECTS__
export function isoWeek(
  message?: ErrorMessage<IsoWeekIssue<string>>
): IsoWeekAction<string, ErrorMessage<IsoWeekIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'iso_week',
    reference: isoWeek,
    async: false,
    expects: null,
    requirement: ISO_WEEK_REGEX,
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'week', dataset, config);
      }
      return dataset;
    },
  };
}
