import { IPV4_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * IPv4 issue type.
 */
export interface Ipv4Issue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'ipv4';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The IPv4 regex.
   */
  readonly requirement: RegExp;
}

/**
 * IPv4 action type.
 */
export interface Ipv4Action<
  TInput extends string,
  TMessage extends ErrorMessage<Ipv4Issue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, Ipv4Issue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'ipv4';
  /**
   * The action reference.
   */
  readonly reference: typeof ipv4;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The IPv4 regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [IPv4](https://en.wikipedia.org/wiki/IPv4) address validation action.
 *
 * @returns An IPv4 action.
 */
export function ipv4<TInput extends string>(): Ipv4Action<TInput, undefined>;

/**
 * Creates an [IPv4](https://en.wikipedia.org/wiki/IPv4) address validation action.
 *
 * @param message The error message.
 *
 * @returns An IPv4 action.
 */
export function ipv4<
  TInput extends string,
  const TMessage extends ErrorMessage<Ipv4Issue<TInput>> | undefined,
>(message: TMessage): Ipv4Action<TInput, TMessage>;

export function ipv4(
  message?: ErrorMessage<Ipv4Issue<string>>
): Ipv4Action<string, ErrorMessage<Ipv4Issue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'ipv4',
    reference: ipv4,
    async: false,
    expects: null,
    requirement: IPV4_REGEX,
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'IPv4', dataset, config);
      }
      return dataset;
    },
  };
}
