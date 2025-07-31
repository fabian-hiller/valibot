import { IPV4_CIDR_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  Dataset,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * IPv4 CIDR issue type.
 */
export interface Ipv4CidrIssue<TInput extends string>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'ipv4_cidr';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The IPv4 CIDR regex.
   */
  readonly requirement: RegExp;
}

/**
 * IPv4 action type.
 */
export interface Ipv4CidrAction<
  TInput extends string,
  TMessage extends ErrorMessage<Ipv4CidrIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, Ipv4CidrIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'ipv4_cidr';
  /**
   * The action reference.
   */
  readonly reference: typeof ipv4Cidr;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The IPv4 CIDR regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [IPv4](https://en.wikipedia.org/wiki/IPv4) address in [CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) validation action.
 *
 * @returns An IPv4 CIDR action.
 */
export function ipv4Cidr<TInput extends string>(): Ipv4CidrAction<
  TInput,
  undefined
>;

/**
 * Creates an [IPv4](https://en.wikipedia.org/wiki/IPv4) address in [CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) validation action.
 *
 * @param message The error message.
 *
 * @returns An IPv4 CIDR action.
 */
export function ipv4Cidr<
  TInput extends string,
  const TMessage extends ErrorMessage<Ipv4CidrIssue<TInput>> | undefined,
>(message: TMessage): Ipv4CidrAction<TInput, TMessage>;

export function ipv4Cidr(
  message?: ErrorMessage<Ipv4CidrIssue<string>>
): Ipv4CidrAction<string, ErrorMessage<Ipv4CidrIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'ipv4_cidr',
    reference: ipv4Cidr,
    async: false,
    expects: null,
    requirement: IPV4_CIDR_REGEX,
    message,
    _run(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'IPv4-CIDR', dataset, config);
      }
      return dataset as Dataset<string, Ipv4CidrIssue<string>>;
    },
  };
}
