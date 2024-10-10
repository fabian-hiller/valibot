import { IPV6_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * IPv6 issue type.
 */
export interface Ipv6Issue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'ipv6';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The IPv6 regex.
   */
  readonly requirement: RegExp;
}

/**
 * IPv6 action type.
 */
export interface Ipv6Action<
  TInput extends string,
  TMessage extends ErrorMessage<Ipv6Issue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, Ipv6Issue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'ipv6';
  /**
   * The action reference.
   */
  readonly reference: typeof ipv6;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The IPv6 regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [IPv6](https://en.wikipedia.org/wiki/IPv6) address validation action.
 *
 * @returns An IPv6 action.
 */
export function ipv6<TInput extends string>(): Ipv6Action<TInput, undefined>;

/**
 * Creates an [IPv6](https://en.wikipedia.org/wiki/IPv6) address validation action.
 *
 * @param message The error message.
 *
 * @returns An IPv6 action.
 */
export function ipv6<
  TInput extends string,
  const TMessage extends ErrorMessage<Ipv6Issue<TInput>> | undefined,
>(message: TMessage): Ipv6Action<TInput, TMessage>;

export function ipv6(
  message?: ErrorMessage<Ipv6Issue<string>>
): Ipv6Action<string, ErrorMessage<Ipv6Issue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'ipv6',
    reference: ipv6,
    async: false,
    expects: null,
    requirement: IPV6_REGEX,
    message,
    '~validate'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'IPv6', dataset, config);
      }
      return dataset;
    },
  };
}
