import { IMEI_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue, _isLuhnAlgo } from '../../utils/index.ts';

/**
 * IMEI issue interface.
 */
export interface ImeiIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'imei';
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
  readonly requirement: (input: string) => boolean;
}

/**
 * IMEI action interface.
 */
export interface ImeiAction<
  TInput extends string,
  TMessage extends ErrorMessage<ImeiIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, ImeiIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'imei';
  /**
   * The action reference.
   */
  readonly reference: typeof imei;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: string) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [IMEI](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity) validation action.
 *
 * Formats:
 * - AABBBBBBCCCCCCD
 * - AA-BBBBBB-CCCCCC-D
 *
 * @returns An IMEI action.
 */
export function imei<TInput extends string>(): ImeiAction<TInput, undefined>;

/**
 * Creates an [IMEI](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity) validation action.
 *
 * Formats:
 * - AABBBBBBCCCCCCD
 * - AA-BBBBBB-CCCCCC-D
 *
 * @param message The error message.
 *
 * @returns An IMEI action.
 */
export function imei<
  TInput extends string,
  const TMessage extends ErrorMessage<ImeiIssue<TInput>> | undefined,
>(message: TMessage): ImeiAction<TInput, TMessage>;

// @__NO_SIDE_EFFECTS__
export function imei(
  message?: ErrorMessage<ImeiIssue<string>>
): ImeiAction<string, ErrorMessage<ImeiIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'imei',
    reference: imei,
    async: false,
    expects: null,
    requirement(input) {
      return IMEI_REGEX.test(input) && _isLuhnAlgo(input);
    },
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, 'IMEI', dataset, config);
      }
      return dataset;
    },
  };
}
