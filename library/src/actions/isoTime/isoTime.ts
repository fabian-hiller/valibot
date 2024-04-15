import { ISO_TIME_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

/**
 * ISO Time issue type.
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
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
  /**
   * The ISO Time regex.
   */
  readonly requirement: RegExp;
}

/**
 * ISO Time action type.
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
   * The expected property.
   */
  readonly expects: null;
  /**
   * The ISO Time regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [ISO Time](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * @returns An ISO Time action.
 */
export function isoTime<TInput extends string>(): IsoTimeAction<
  TInput,
  undefined
>;

/**
 * Creates a [ISO Time](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * @param message The error message.
 *
 * @returns An ISO Time action.
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
    async: false,
    expects: null,
    requirement: ISO_TIME_REGEX,
    message,
    _run(dataset, config) {
      return _validationDataset(
        this,
        isoTime,
        'ISO Time',
        dataset.typed && !this.requirement.test(dataset.value),
        dataset,
        config
      );
    },
  };
}
