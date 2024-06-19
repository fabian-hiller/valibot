import { ISO_TIME_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  Dataset,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * ISO time issue type.
 */
export interface IsoTimeIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'iso_time';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The ISO time regex.
   */
  readonly requirement: RegExp;
}

/**
 * ISO time action type.
 */
export interface IsoTimeAction<
  TInput extends string,
  TMessage extends ErrorMessage<IsoTimeIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, IsoTimeIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'iso_time';
  /**
   * The action reference.
   */
  readonly reference: typeof isoTime;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The ISO time regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [ISO time](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: hh:mm
 *
 * @returns An ISO time action.
 */
export function isoTime<TInput extends string>(): IsoTimeAction<
  TInput,
  undefined
>;

/**
 * Creates an [ISO time](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: hh:mm
 *
 * @param message The error message.
 *
 * @returns An ISO time action.
 */
export function isoTime<
  TInput extends string,
  const TMessage extends ErrorMessage<IsoTimeIssue<TInput>> | undefined,
>(message: TMessage): IsoTimeAction<TInput, TMessage>;

export function isoTime(
  message?: ErrorMessage<IsoTimeIssue<string>>
): IsoTimeAction<string, ErrorMessage<IsoTimeIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'iso_time',
    reference: isoTime,
    async: false,
    expects: null,
    requirement: ISO_TIME_REGEX,
    message,
    _run(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'time', dataset, config);
      }
      return dataset as Dataset<string, IsoTimeIssue<string>>;
    },
  };
}
