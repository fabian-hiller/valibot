import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import { isISO8601Duration } from "./isISO8601Duration.ts";

/**
 * ISO duration issue interface.
 */
export interface IsoDurationIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'iso_duration';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
 /**
   * The validation function.
   */
 readonly requirement: (input: TInput) => boolean;
}

/**
 * ISO duration action interface.
 */
export interface IsoDurationAction<
  TInput extends string,
  TMessage extends ErrorMessage<IsoDurationIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, IsoDurationIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'iso_duration';
  /**
   * The action reference.
   */
  readonly reference: typeof isoDuration;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: TInput) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [ISO duration](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: P[n]Y[n]M[n]DT[n]H[n]M[n]S
 *
 * @returns An ISO duration action.
 */
export function isoDuration<TInput extends string>(): IsoDurationAction<
  TInput,
  undefined
>;

/**
 * Creates an [ISO duration](https://en.wikipedia.org/wiki/ISO_8601) validation action.
 *
 * Format: P[n]Y[n]M[n]DT[n]H[n]M[n]S
 * 
 * @param message The error message.
 *
 * @returns An ISO duration action.
 */
export function isoDuration<
  TInput extends string,
  const TMessage extends ErrorMessage<IsoDurationIssue<TInput>> | undefined,
>(message: TMessage): IsoDurationAction<TInput, TMessage>;

// @__NO_SIDE_EFFECTS__
export function isoDuration(
  message?: ErrorMessage<IsoDurationIssue<string>>
): IsoDurationAction<string, ErrorMessage<IsoDurationIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'iso_duration',
    reference: isoDuration,
    async: false,
    expects: null,
    requirement: isISO8601Duration,
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, 'duration', dataset, config);
      }
      return dataset;
    },
  };
}
