import type { BaseIssue, BaseValidation, ErrorMessage } from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

type NotBytesType = 'not_bytes';

/**
 * Not bytes issue type.
 */
export interface NotBytesIssue<
  TInput extends string,
  TRequirement extends number
> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: NotBytesType;
  /**
   * The expected input.
   */ 
  readonly expected: `!${TRequirement}`;
  /**
   * The received input.
   */
  readonly received: `${number}`;
  /**
   * The byte length.
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
  readonly type: NotBytesType;
  /**
   * The expected property.
   */
  readonly expects: `!${TRequirement}`;
  /**
   * The byte length.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a pipeline validation action that validates the bytes of a string.
 *
 * @param requirement The byte length.
 *
 * @returns A validation action.
 */
export function notBytes<
  TInput extends string,
  const TRequirement extends number
>(requirement: TRequirement): NotBytesAction<TInput, TRequirement, undefined>;

/**
 * Creates a pipeline validation action that validates the bytes of a string.
 *
 * @param requirement The byte length.
 * @param message The error message.
 * 
 * @returns A validation action.
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
    expects: `!${requirement}`,
    async: false,
    message,
    requirement,
    _run(dataset, config) {
      if (dataset.typed) {
        // Calculate byte length
        const length = (new TextEncoder()).encode(dataset.value).length;
        // If requirement is not fulfilled, add an issue
        if (length === this.requirement) {
          _addIssue(this, notBytes, 'bytes', dataset, config, {
            received: `${length}`
          });
        }
      }
      return dataset;
    },
  };
}
