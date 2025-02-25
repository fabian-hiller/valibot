import { IPV6_CIDR_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  Dataset,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * IPv6 CIDR issue type.
 */
export interface Ipv6CidrIssue<TInput extends string>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'ipv6_cidr';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The IPv6 CIDR regex.
   */
  readonly requirement: RegExp;
}

/**
 * IPv6 CIDR action type.
 */
export interface Ipv6CidrAction<
  TInput extends string,
  TMessage extends ErrorMessage<Ipv6CidrIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, Ipv6CidrIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'ipv6_cidr';
  /**
   * The action reference.
   */
  readonly reference: typeof ipv6Cidr;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The IPv6 CIDR regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [IPv6](https://en.wikipedia.org/wiki/IPv6) address in [CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) validation action.
 *
 * @returns An IPv6 CIDR action.
 */
export function ipv6Cidr<TInput extends string>(): Ipv6CidrAction<
  TInput,
  undefined
>;

/**
 * Creates an [IPv6](https://en.wikipedia.org/wiki/IPv6) in [CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) address validation action.
 *
 * @param message The error message.
 *
 * @returns An IPv6 CIDR action.
 */
export function ipv6Cidr<
  TInput extends string,
  const TMessage extends ErrorMessage<Ipv6CidrIssue<TInput>> | undefined,
>(message: TMessage): Ipv6CidrAction<TInput, TMessage>;

export function ipv6Cidr(
  message?: ErrorMessage<Ipv6CidrIssue<string>>
): Ipv6CidrAction<string, ErrorMessage<Ipv6CidrIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'ipv6_cidr',
    reference: ipv6Cidr,
    async: false,
    expects: null,
    requirement: IPV6_CIDR_REGEX,
    message,
    _run(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'IPv6-CIDR', dataset, config);
      }
      return dataset as Dataset<string, Ipv6CidrIssue<string>>;
    },
  };
}
