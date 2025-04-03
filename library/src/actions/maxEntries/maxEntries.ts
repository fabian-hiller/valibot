import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Max entries issue interface.
 *
 * @beta
 */
export interface MaxEntriesIssue<
  TInput extends Record<string, unknown>,
  TRequirement extends number,
> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'max_entries';
  /**
   * The expected property.
   */
  readonly expected: `<=${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The maximum entries.
   */
  readonly requirement: TRequirement;
}

/**
 * Max entries action interface.
 *
 * @beta
 */
export interface MaxEntriesAction<
  TInput extends Record<string, unknown>,
  TRequirement extends number,
  TMessage extends
    | ErrorMessage<MaxEntriesIssue<TInput, TRequirement>>
    | undefined,
> extends BaseValidation<
    TInput,
    TInput,
    MaxEntriesIssue<TInput, TRequirement>
  > {
  /**
   * The action type.
   */
  readonly type: 'max_entries';
  /**
   * The action reference.
   */
  readonly reference: typeof maxEntries;
  /**
   * The expected property.
   */
  readonly expects: `<=${TRequirement}`;
  /**
   * The maximum entries.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a max entries validation action.
 *
 * @param requirement The maximum entries.
 *
 * @returns A max entries action.
 *
 * @beta
 */
export function maxEntries<
  TInput extends Record<string, unknown>,
  const TRequirement extends number,
>(requirement: TRequirement): MaxEntriesAction<TInput, TRequirement, undefined>;

/**
 * Creates a max entries validation action.
 *
 * @param requirement The maximum entries.
 * @param message The error message.
 *
 * @returns A max entries action.
 *
 * @beta
 */
export function maxEntries<
  TInput extends Record<string, unknown>,
  const TRequirement extends number,
  const TMessage extends
    | ErrorMessage<MaxEntriesIssue<TInput, TRequirement>>
    | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): MaxEntriesAction<TInput, TRequirement, TMessage>;

// @__NO_SIDE_EFFECTS__
export function maxEntries(
  requirement: number,
  message?: ErrorMessage<MaxEntriesIssue<Record<string, unknown>, number>>
): MaxEntriesAction<
  Record<string, unknown>,
  number,
  ErrorMessage<MaxEntriesIssue<Record<string, unknown>, number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'max_entries',
    reference: maxEntries,
    async: false,
    expects: `<=${requirement}`,
    requirement,
    message,
    '~run'(dataset, config) {
      if (!dataset.typed) return dataset;
      const count = Object.keys(dataset.value).length;
      if (dataset.typed && count > this.requirement) {
        _addIssue(this, 'properties', dataset, config, {
          received: `${count}`,
        });
      }
      return dataset;
    },
  };
}
