import { DOMAIN_NAME_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Domain name issue type.
 */
export interface DomainNameIssue<TInput extends string>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'domainName';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The domain name regex.
   */
  readonly requirement: RegExp;
}

/**
 * Domain name action type.
 */
export interface DomainNameAction<
  TInput extends string,
  TMessage extends ErrorMessage<DomainNameIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, DomainNameIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'domainName';
  /**
   * The action reference.
   */
  readonly reference: typeof domainName;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The domain name regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [domain name](https://en.wikipedia.org/wiki/Domain_name) validation
 * action.
 *
 * @returns An domain name action.
 */
export function domainName<TInput extends string>(): DomainNameAction<
  TInput,
  undefined
>;

/**
 * Creates an [domain name](https://en.wikipedia.org/wiki/Domain_name) validation
 * action.
 *
 * @param message The error message.
 *
 * @returns An domain name action.
 */
export function domainName<
  TInput extends string,
  const TMessage extends ErrorMessage<DomainNameIssue<TInput>> | undefined,
>(message: TMessage): DomainNameAction<TInput, TMessage>;

export function domainName(
  message?: ErrorMessage<DomainNameIssue<string>>
): DomainNameAction<string, ErrorMessage<DomainNameIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'domainName',
    reference: domainName,
    expects: null,
    async: false,
    requirement: DOMAIN_NAME_REGEX,
    message,
    '~validate'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'domainName', dataset, config);
      }
      return dataset;
    },
  };
}
