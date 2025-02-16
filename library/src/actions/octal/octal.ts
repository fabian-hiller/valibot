import { OCTAL_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Octal issue interface.
 */
export interface OctalIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'octal';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The octal regex.
   */
  readonly requirement: RegExp;
}

/**
 * Octal action interface.
 */
export interface OctalAction<
  TInput extends string,
  TMessage extends ErrorMessage<OctalIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, OctalIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'octal';
  /**
   * The action reference.
   */
  readonly reference: typeof octal;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The octal regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [octal](https://en.wikipedia.org/wiki/Octal) validation action.
 *
 * @returns An octal action.
 */
export function octal<TInput extends string>(): OctalAction<TInput, undefined>;

/**
 * Creates an [octal](https://en.wikipedia.org/wiki/Octal) validation action.
 *
 * @param message The error message.
 *
 * @returns An octal action.
 */
export function octal<
  TInput extends string,
  const TMessage extends ErrorMessage<OctalIssue<TInput>> | undefined,
>(message: TMessage): OctalAction<TInput, TMessage>;

// @__NO_SIDE_EFFECTS__
export function octal(
  message?: ErrorMessage<OctalIssue<string>>
): OctalAction<string, ErrorMessage<OctalIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'octal',
    reference: octal,
    async: false,
    expects: null,
    requirement: OCTAL_REGEX,
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'octal', dataset, config);
      }
      return dataset;
    },
  };
}
