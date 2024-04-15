import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Bytes issue type.
 */
export interface BytesIssue<TInput extends string, TRequirement extends number>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'bytes';
  /**
   * The expected input.
   */
  readonly expected: `${TRequirement}`;
  /**
   * The received input.
   */
  readonly received: `${number}`;
  /**
   * The required bytes.
   */
  readonly requirement: TRequirement;
}

/**
 * Bytes action type.
 */
export interface BytesAction<
  TInput extends string,
  TRequirement extends number,
  TMessage extends ErrorMessage<BytesIssue<TInput, TRequirement>> | undefined,
> extends BaseValidation<TInput, TInput, BytesIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: 'bytes';
  /**
   * The expected property.
   */
  readonly expects: `${TRequirement}`;
  /**
   * The required bytes.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a bytes validation action.
 *
 * @param requirement The required bytes.
 *
 * @returns A bytes action.
 */
export function bytes<TInput extends string, const TRequirement extends number>(
  requirement: TRequirement
): BytesAction<TInput, TRequirement, undefined>;

/**
 * Creates a bytes validation action.
 *
 * @param requirement The required bytes.
 * @param message The error message.
 *
 * @returns A bytes action.
 */
export function bytes<
  TInput extends string,
  const TRequirement extends number,
  const TMessage extends
    | ErrorMessage<BytesIssue<TInput, TRequirement>>
    | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): BytesAction<TInput, TRequirement, TMessage>;

export function bytes(
  requirement: number,
  message?: ErrorMessage<BytesIssue<string, number>>
): BytesAction<
  string,
  number,
  ErrorMessage<BytesIssue<string, number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'bytes',
    async: false,
    expects: `${requirement}`,
    requirement,
    message,
    _run(dataset, config) {
      if (dataset.typed) {
        const length = new TextEncoder().encode(dataset.value).length;
        if (length !== this.requirement) {
          _addIssue(this, bytes, 'bytes', dataset, config, {
            received: `${length}`,
          });
        }
      }
      return dataset;
    },
  };
}
