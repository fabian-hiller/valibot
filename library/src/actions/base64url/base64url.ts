import { BASE64URL_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Base64url issue interface.
 */
export interface Base64urlIssue<TInput extends string>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'base64url';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The Base64url regex.
   */
  readonly requirement: RegExp;
}

/**
 * Base64url action interface.
 */
export interface Base64urlAction<
  TInput extends string,
  TMessage extends ErrorMessage<Base64urlIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, Base64urlIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'base64url';
  /**
   * The action reference.
   */
  readonly reference: typeof base64url;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The Base64url regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5) validation action.
 *
 * @returns A base64url action.
 */
export function base64url<TInput extends string>(): Base64urlAction<
  TInput,
  undefined
>;

/**
 * Creates a [base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5) validation action.
 *
 * @param message The error message.
 *
 * @returns A base64url action.
 */
export function base64url<
  TInput extends string,
  const TMessage extends ErrorMessage<Base64urlIssue<TInput>> | undefined,
>(message: TMessage): Base64urlAction<TInput, TMessage>;

// @__NO_SIDE_EFFECTS__
export function base64url(
  message?: ErrorMessage<Base64urlIssue<string>>
): Base64urlAction<string, ErrorMessage<Base64urlIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'base64url',
    reference: base64url,
    async: false,
    expects: null,
    requirement: BASE64URL_REGEX,
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'Base64url', dataset, config);
      }
      return dataset;
    },
  };
}
