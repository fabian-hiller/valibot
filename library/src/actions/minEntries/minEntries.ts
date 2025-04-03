import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Min entries issue interface.
 *
 * @beta
 */
export interface MinEntriesIssue<
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
  readonly type: 'min_entries';
  /**
   * The expected property.
   */
  readonly expected: `>=${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The minimum entries.
   */
  readonly requirement: TRequirement;
}

/**
 * Min entries action interface.
 *
 * @beta
 */
export interface MinEntriesAction<
  TInput extends Record<string, unknown>,
  TRequirement extends number,
  TMessage extends
    | ErrorMessage<MinEntriesIssue<TInput, TRequirement>>
    | undefined,
> extends BaseValidation<
    TInput,
    TInput,
    MinEntriesIssue<TInput, TRequirement>
  > {
  /**
   * The action type.
   */
  readonly type: 'min_entries';
  /**
   * The action reference.
   */
  readonly reference: typeof minEntries;
  /**
   * The expected property.
   */
  readonly expects: `>=${TRequirement}`;
  /**
   * The minimum entries.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a min entries validation action.
 *
 * @param requirement The minimum entries.
 *
 * @returns A min entries action.
 *
 * @beta
 */
export function minEntries<
  TInput extends Record<string, unknown>,
  const TRequirement extends number,
>(requirement: TRequirement): MinEntriesAction<TInput, TRequirement, undefined>;

/**
 * Creates a min entries validation action.
 *
 * @param requirement The minimum entries.
 * @param message The error message.
 *
 * @returns A min entries action.
 *
 * @beta
 */
export function minEntries<
  TInput extends Record<string, unknown>,
  const TRequirement extends number,
  const TMessage extends
    | ErrorMessage<MinEntriesIssue<TInput, TRequirement>>
    | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): MinEntriesAction<TInput, TRequirement, TMessage>;

// @__NO_SIDE_EFFECTS__
export function minEntries(
  requirement: number,
  message?: ErrorMessage<MinEntriesIssue<Record<string, unknown>, number>>
): MinEntriesAction<
  Record<string, unknown>,
  number,
  ErrorMessage<MinEntriesIssue<Record<string, unknown>, number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'min_entries',
    reference: minEntries,
    async: false,
    expects: `>=${requirement}`,
    requirement,
    message,
    '~run'(dataset, config) {
      if (!dataset.typed) return dataset;
      const count = Object.keys(dataset.value).length;
      if (dataset.typed && count < this.requirement) {
        _addIssue(this, 'properties', dataset, config, {
          received: `${count}`,
        });
      }
      return dataset;
    },
  };
}
