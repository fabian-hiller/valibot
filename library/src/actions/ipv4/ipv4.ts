import { IPV4_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

/**
 * IPV4 issue type.
 */
export interface IpV4Issue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'ipv4';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
  /**
   * The IPv4 regex.
   */
  readonly requirement: RegExp;
}

/**
 * IPV4 action type.
 */
export interface IpV4Action<
  TInput extends string,
  TMessage extends ErrorMessage<IpV4Issue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, IpV4Issue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'ipv4';
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
 * Creates a [IPv4](https://en.wikipedia.org/wiki/IPv4) address validation action.
 *
 * @returns A IPV4 action.
 */
export function ipv4<TInput extends string>(): IpV4Action<TInput, undefined>;

/**
 * Creates a [IPv4](https://en.wikipedia.org/wiki/IPv4) address validation action.
 *
 * @param message The error message.
 *
 * @returns A IPV4 action.
 */
export function ipv4<
  TInput extends string,
  const TMessage extends ErrorMessage<IpV4Issue<TInput>> | undefined,
>(message: TMessage): IpV4Action<TInput, TMessage>;

export function ipv4(
  message?: ErrorMessage<IpV4Issue<string>>
): IpV4Action<string, ErrorMessage<IpV4Issue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'ipv4',
    async: false,
    expects: null,
    requirement: IPV4_REGEX,
    message,
    _run(dataset, config) {
      return _validationDataset(
        this,
        ipv4,
        'ipv4',
        dataset.typed && !this.requirement.test(dataset.value),
        dataset,
        config
      );
    },
  };
}
