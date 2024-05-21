import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Not bytes issue type.
 */
export interface NotBytesIssue<
  TInput extends string,
  TRequirement extends number,
> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'not_bytes';
  /**
   * The expected property.
   */
  readonly expected: `!${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The not required bytes.
   */
  readonly requirement: TRequirement;
}

/**
 * Not bytes action type.
 */
export interface NotBytesAction<
  TInput extends string,
  TRequirement extends number,
  TMessage extends
    | ErrorMessage<NotBytesIssue<TInput, TRequirement>>
    | undefined,
> extends BaseValidation<TInput, TInput, NotBytesIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: 'not_bytes';
  /**
   * The action reference.
   */
  readonly reference: typeof notBytes;
  /**
   * The expected property.
   */
  readonly expects: `!${TRequirement}`;
  /**
   * The not required bytes.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a not bytes validation action.
 *
 * @param requirement The not required bytes.
 *
 * @returns A not bytes action.
 */
export function notBytes<
  TInput extends string,
  const TRequirement extends number,
>(requirement: TRequirement): NotBytesAction<TInput, TRequirement, undefined>;

/**
 * Creates a not bytes validation action.
 *
 * @param requirement The not required bytes.
 * @param message The error message.
 *
 * @returns A not bytes action.
 */
export function notBytes<
  TInput extends string,
  const TRequirement extends number,
  const TMessage extends
    | ErrorMessage<NotBytesIssue<TInput, TRequirement>>
    | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): NotBytesAction<TInput, TRequirement, TMessage>;

export function notBytes(
  requirement: number,
  message?: ErrorMessage<NotBytesIssue<string, number>>
): NotBytesAction<
  string,
  number,
  ErrorMessage<NotBytesIssue<string, number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'not_bytes',
    reference: notBytes,
    async: false,
    expects: `!${requirement}`,
    requirement,
    message,
    _run(dataset, config) {
      if (dataset.typed) {
        const length = new TextEncoder().encode(dataset.value).length;
        if (length === this.requirement) {
          _addIssue(this, 'bytes', dataset, config, {
            received: `${length}`,
          });
        }
      }
      return dataset;
    },
  };
}
