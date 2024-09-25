import { IP_CIDR_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  Dataset,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * IP CIDR issue type.
 */
export interface IpCidrIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'ip_cidr';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The IP CIDR regex.
   */
  readonly requirement: RegExp;
}

/**
 * IP CIDR action type.
 */
export interface IpCidrAction<
  TInput extends string,
  TMessage extends ErrorMessage<IpCidrIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, IpCidrIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'ip_cidr';
  /**
   * The action reference.
   */
  readonly reference: typeof ipCidr;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The IP CIDR regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [IP address in CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) validation action.
 *
 * @returns An IP CIDR action.
 */
export function ipCidr<TInput extends string>(): IpCidrAction<TInput, undefined>;

/**
 * Creates an [IP address in CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) validation action.
 *
 * @param message The error message.
 *
 * @returns An IP CIDR action.
 */
export function ipCidr<
  TInput extends string,
  const TMessage extends ErrorMessage<IpCidrIssue<TInput>> | undefined,
>(message: TMessage): IpCidrAction<TInput, TMessage>;

export function ipCidr(
  message?: ErrorMessage<IpCidrIssue<string>>
): IpCidrAction<string, ErrorMessage<IpCidrIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'ip_cidr',
    reference: ipCidr,
    async: false,
    expects: null,
    requirement: IP_CIDR_REGEX,
    message,
    _run(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'IP-CIDR', dataset, config);
      }
      return dataset as Dataset<string, IpCidrIssue<string>>;
    },
  };
}
