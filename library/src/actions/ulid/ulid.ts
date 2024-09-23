import { ULID_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * ULID issue type.
 */
export interface UlidIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'ulid';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The ULID regex.
   */
  readonly requirement: RegExp;
}

/**
 * ULID action type.
 */
export interface UlidAction<
  TInput extends string,
  TMessage extends ErrorMessage<UlidIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, UlidIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'ulid';
  /**
   * The action reference.
   */
  readonly reference: typeof ulid;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The ULID regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an [ULID](https://github.com/ulid/spec) validation action.
 *
 * @returns An ULID action.
 */
export function ulid<TInput extends string>(): UlidAction<TInput, undefined>;

/**
 * Creates an [ULID](https://github.com/ulid/spec) validation action.
 *
 * @param message The error message.
 *
 * @returns An ULID action.
 */
export function ulid<
  TInput extends string,
  const TMessage extends ErrorMessage<UlidIssue<TInput>> | undefined,
>(message: TMessage): UlidAction<TInput, TMessage>;

export function ulid(
  message?: ErrorMessage<UlidIssue<string>>
): UlidAction<string, ErrorMessage<UlidIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'ulid',
    reference: ulid,
    async: false,
    expects: null,
    requirement: ULID_REGEX,
    message,
    '~validate'(dataset, config) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, 'ULID', dataset, config);
      }
      return dataset as OutputDataset<string, UlidIssue<string>>;
    },
  };
}
