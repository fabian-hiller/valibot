import { ISO_DATE_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  Dataset,
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
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
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
 * @param message The error message.
 *
 * @returns An ISO date action.
 */
export function isoDate<
  TInput extends string,
  const TMessage extends ErrorMessage<IsoDateIssue<TInput>> | undefined,
>(message: TMessage): IsoDateAction<TInput, TMessage>;

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
    _run(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'date', dataset, config);
      }
      return dataset as Dataset<string, IsoDateIssue<string>>;
    },
  };
}
