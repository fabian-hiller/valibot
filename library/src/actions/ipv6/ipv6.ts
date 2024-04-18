import { IPV6_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

/**
 * IPV6 issue type.
 */
export interface IpV6Issue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'ipv6';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
  /**
   * The IPv6 regex.
   */
  readonly requirement: RegExp;
}

/**
 * IPV6 action type.
 */
export interface IpV6Action<
  TInput extends string,
  TMessage extends ErrorMessage<IpV6Issue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, IpV6Issue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'ipv6';
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
 * Creates a [IPv6](https://en.wikipedia.org/wiki/IPv6) address validation action.
 *
 * @returns A IPV6 action.
 */
export function ipv6<TInput extends string>(): IpV6Action<TInput, undefined>;

/**
 * Creates a [IPv6](https://en.wikipedia.org/wiki/IPv6) address validation action.
 *
 * @param message The error message.
 *
 * @returns A IPV6 action.
 */
export function ipv6<
  TInput extends string,
  const TMessage extends ErrorMessage<IpV6Issue<TInput>> | undefined,
>(message: TMessage): IpV6Action<TInput, TMessage>;

export function ipv6(
  message?: ErrorMessage<IpV6Issue<string>>
): IpV6Action<string, ErrorMessage<IpV6Issue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'ipv6',
    async: false,
    expects: null,
    requirement: IPV6_REGEX,
    message,
    _run(dataset, config) {
      return _validationDataset(
        this,
        ipv6,
        'ipv6',
        dataset.typed && !this.requirement.test(dataset.value),
        dataset,
        config
      );
    },
  };
}
