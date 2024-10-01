import { IP_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * IP issue type.
 */
export interface IpIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'ip';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The IP regex.
   */
  readonly requirement: RegExp;
}

/**
 * IP action type.
 */
export interface IpAction<
  TInput extends string,
  TMessage extends ErrorMessage<IpIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, IpIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'ip';
  /**
   * The action reference.
   */
  readonly reference: typeof ip;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The IP regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [IP address](https://en.wikipedia.org/wiki/IP_address) validation action.
 *
 * @returns An IP action.
 */
export function ip<TInput extends string>(): IpAction<TInput, undefined>;

/**
 * Creates an [IP address](https://en.wikipedia.org/wiki/IP_address) validation action.
 *
 * @param message The error message.
 *
 * @returns An IP action.
 */
export function ip<
  TInput extends string,
  const TMessage extends ErrorMessage<IpIssue<TInput>> | undefined,
>(message: TMessage): IpAction<TInput, TMessage>;

export function ip(
  message?: ErrorMessage<IpIssue<string>>
): IpAction<string, ErrorMessage<IpIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'ip',
    reference: ip,
    async: false,
    expects: null,
    requirement: IP_REGEX,
    message,
    '~validate'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'IP', dataset, config);
      }
      return dataset;
    },
  };
}
