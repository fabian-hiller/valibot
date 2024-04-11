import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Min length issue type.
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
   * The expected input.
   */
  readonly expected: `>=${TRequirement}`;
  /**
   * The received input.
   */
  readonly received: `${number}`;
  /**
   * The minimum length.
   */
  readonly requirement: TRequirement;
}

/**
 * Min length action type.
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
   * The expected property.
   */
  readonly expects: `>=${TRequirement}`;
  /**
   * The minimum length.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a pipeline validation action that validates the length of a string
 * or array.
 *
 * @param requirement The minimum length.
 *
 * @returns A validation action.
 */
export function minBytes<
  TInput extends string,
  const TRequirement extends number,
>(requirement: TRequirement): MinBytesAction<TInput, TRequirement, undefined>;

/**
 * Creates a pipeline validation action that validates the length of a string
 * or array.
 *
 * @param requirement The minimum length.
 * @param message The error message.
 *
 * @returns A validation action.
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
    expects: `>=${requirement}`,
    async: false,
    message,
    requirement,
    _run(dataset, config) {
      const getBytesLength = (value: string) => new TextEncoder().encode(value).length;

      if (dataset.typed && getBytesLength(dataset.value) < this.requirement) {
        _addIssue(this, minBytes, 'bytes', dataset, config, {
          received: `${getBytesLength(dataset.value)}`,
        });
      }
      return dataset;
    },
  };
}
