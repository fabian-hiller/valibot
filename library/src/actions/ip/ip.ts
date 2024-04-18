import { IPV4_REGEX, IPV6_REGEX } from '../../regex.ts';
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
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
  /**
   * The IPv4 and IPv6 regex.
   */
  readonly requirement: [RegExp, RegExp];
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
   * The expected property.
   */
  readonly expects: null;
  /**
   * The IPv4 and IPv6 regex.
   */
  readonly requirement: [RegExp, RegExp];
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [IPv4](https://en.wikipedia.org/wiki/IPv4)
 * or [IPv6](https://en.wikipedia.org/wiki/IPv6) address validation action.
 *
 * @returns A IP action.
 */
export function ip<TInput extends string>(): IpAction<TInput, undefined>;

/**
 * Creates a [IPv4](https://en.wikipedia.org/wiki/IPv4)
 * or [IPv6](https://en.wikipedia.org/wiki/IPv6) address validation action.
 *
 * @param message The error message.
 *
 * @returns A IP action.
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
    async: false,
    expects: null,
    requirement: [IPV4_REGEX, IPV6_REGEX],
    message,
    _run(dataset, config) {
      if (dataset.typed) {
        const isIpv4 = this.requirement[0].test(dataset.value);

        const isIpv6 = this.requirement[1].test(dataset.value);

        if (!isIpv4 && !isIpv6) {
          _addIssue(this, ip, 'ip', dataset, config);
        }
      }
      return dataset;
    },
  };
}
