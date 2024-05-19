import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Min bytes issue type.
 */
export interface MinBytesIssue<
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
  readonly type: 'min_bytes';
  /**
   * The expected property.
   */
  readonly expected: `>=${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The minimum bytes.
   */
  readonly requirement: TRequirement;
}

/**
 * Min bytes action type.
 */
export interface MinBytesAction<
  TInput extends string,
  TRequirement extends number,
  TMessage extends
    | ErrorMessage<MinBytesIssue<TInput, TRequirement>>
    | undefined,
> extends BaseValidation<TInput, TInput, MinBytesIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: 'min_bytes';
  /**
   * The action reference.
   */
  readonly reference: typeof minBytes;
  /**
   * The expected property.
   */
  readonly expects: `>=${TRequirement}`;
  /**
   * The minimum bytes.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a min bytes validation action.
 *
 * @param requirement The minimum bytes.
 *
 * @returns A min bytes action.
 */
export function minBytes<
  TInput extends string,
  const TRequirement extends number,
>(requirement: TRequirement): MinBytesAction<TInput, TRequirement, undefined>;

/**
 * Creates a min bytes validation action.
 *
 * @param requirement The minimum bytes.
 * @param message The error message.
 *
 * @returns A min bytes action.
 */
export function minBytes<
  TInput extends string,
  const TRequirement extends number,
  const TMessage extends
    | ErrorMessage<MinBytesIssue<TInput, TRequirement>>
    | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): MinBytesAction<TInput, TRequirement, TMessage>;

export function minBytes(
  requirement: number,
  message?: ErrorMessage<MinBytesIssue<string, number>>
): MinBytesAction<
  string,
  number,
  ErrorMessage<MinBytesIssue<string, number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'min_bytes',
    reference: minBytes,
    async: false,
    expects: `>=${requirement}`,
    requirement,
    message,
    _run(dataset, config) {
      if (dataset.typed) {
        const length = new TextEncoder().encode(dataset.value).length;
        if (length < this.requirement) {
          _addIssue(this, 'bytes', dataset, config, {
            received: `${length}`,
          });
        }
      }
      return dataset;
    },
  };
}
