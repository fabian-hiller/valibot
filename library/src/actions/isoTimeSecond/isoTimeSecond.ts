import { ISO_TIME_SECOND_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  Dataset,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * ISO time with seconds issue type.
 */
export interface IsoTimeSecondIssue<TInput extends string>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'iso_time_second';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
  /**
   * The ISO time with seconds regex.
   */
  readonly requirement: RegExp;
}

/**
 * ISO time with seconds action type.
 */
export interface IsoTimeSecondAction<
  TInput extends string,
  TMessage extends ErrorMessage<IsoTimeSecondIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, IsoTimeSecondIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'iso_time_second';
  /**
   * The action reference.
   */
  readonly reference: typeof isoTimeSecond;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The ISO time with seconds regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [ISO time with seconds](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: hh:mm:ss
 *
 * @returns An ISO time with seconds action.
 */
export function isoTimeSecond<TInput extends string>(): IsoTimeSecondAction<
  TInput,
  undefined
>;

/**
 * Creates an [ISO time with seconds](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: hh:mm:ss
 *
 * @param message The error message.
 *
 * @returns An ISO time with seconds action.
 */
export function isoTimeSecond<
  TInput extends string,
  const TMessage extends ErrorMessage<IsoTimeSecondIssue<TInput>> | undefined,
>(message: TMessage): IsoTimeSecondAction<TInput, TMessage>;

export function isoTimeSecond(
  message?: ErrorMessage<IsoTimeSecondIssue<string>>
): IsoTimeSecondAction<
  string,
  ErrorMessage<IsoTimeSecondIssue<string>> | undefined
> {
  return {
    kind: 'validation',
    type: 'iso_time_second',
    reference: isoTimeSecond,
    async: false,
    expects: null,
    requirement: ISO_TIME_SECOND_REGEX,
    message,
    _run(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'time-second', dataset, config);
      }
      return dataset as Dataset<string, IsoTimeSecondIssue<string>>;
    },
  };
}
