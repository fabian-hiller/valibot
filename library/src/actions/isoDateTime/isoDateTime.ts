import { ISO_DATE_TIME_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  Dataset,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * ISO date time issue type.
 */
export interface IsoDateTimeIssue<TInput extends string>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'iso_datetime';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
  /**
   * The ISO date time regex.
   */
  readonly requirement: RegExp;
}

/**
 * ISO date time action type.
 */
export interface IsoDateTimeAction<
  TInput extends string,
  TMessage extends ErrorMessage<IsoDateTimeIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, IsoDateTimeIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'iso_datetime';
  /**
   * The action reference.
   */
  readonly reference: typeof isoDateTime;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The ISO date time regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [ISO date time](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: yyyy-mm-ddThh:mm
 *
 * @returns An ISO date time action.
 */
export function isoDateTime<TInput extends string>(): IsoDateTimeAction<
  TInput,
  undefined
>;

/**
 * Creates an [ISO date time](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: yyyy-mm-ddThh:mm
 *
 * @param message The error message.
 *
 * @returns An ISO date time action.
 */
export function isoDateTime<
  TInput extends string,
  const TMessage extends ErrorMessage<IsoDateTimeIssue<TInput>> | undefined,
>(message: TMessage): IsoDateTimeAction<TInput, TMessage>;

export function isoDateTime(
  message?: ErrorMessage<IsoDateTimeIssue<string>>
): IsoDateTimeAction<
  string,
  ErrorMessage<IsoDateTimeIssue<string>> | undefined
> {
  return {
    kind: 'validation',
    type: 'iso_datetime',
    reference: isoDateTime,
    async: false,
    expects: null,
    requirement: ISO_DATE_TIME_REGEX,
    message,
    _run(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'time', dataset, config);
      }
      return dataset as Dataset<string, IsoDateTimeIssue<string>>;
    },
  };
}
