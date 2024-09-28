import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue, _getGraphemeCount } from '../../utils/index.ts';

/**
 * Min grapheme count issue type.
 */
export interface MinGraphemeCountIssue<
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
  readonly type: 'min_grapheme_count';
  /**
   * The expected property.
   */
  readonly expected: `>=${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The minimum grapheme count.
   */
  readonly requirement: TRequirement;
}

/**
 * Min grapheme count action type.
 */
export interface MinGraphemeCountAction<
  TInput extends string,
  TRequirement extends number,
  TMessage extends
  | ErrorMessage<MinGraphemeCountIssue<TInput, TRequirement>>
  | undefined,
> extends BaseValidation<
  TInput,
  TInput,
  MinGraphemeCountIssue<TInput, TRequirement>
> {
  /**
   * The action type.
   */
  readonly type: 'min_grapheme_count';
  /**
   * The action reference.
   */
  readonly reference: typeof minGraphemeCount;
  /**
   * The expected property.
   */
  readonly expects: `>=${TRequirement}`;
  /**
   * The minimum grapheme count.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a min grapheme count validation action.
 *
 * @param requirement The minimum grapheme count.
 *
 * @returns A min grapheme count action.
 */
export function minGraphemeCount<
  TInput extends string,
  const TRequirement extends number,
>(
  requirement: TRequirement,
): MinGraphemeCountAction<TInput, TRequirement, undefined>;

/**
 * Creates a min grapheme count validation action.
 *
 * @param requirement The minimum grapheme count.
 * @param message The error message.
 *
 * @returns A min grapheme count action.
 */
export function minGraphemeCount<
  TInput extends string,
  const TRequirement extends number,
  const TMessage extends
  | ErrorMessage<MinGraphemeCountIssue<TInput, TRequirement>>
  | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): MinGraphemeCountAction<TInput, TRequirement, TMessage>;

export function minGraphemeCount(
  requirement: number,
  message?: ErrorMessage<MinGraphemeCountIssue<string, number>>
): MinGraphemeCountAction<
  string,
  number,
  ErrorMessage<MinGraphemeCountIssue<string, number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'min_grapheme_count',
    reference: minGraphemeCount,
    async: false,
    expects: `>=${requirement}`,
    requirement,
    message,
    _run(dataset, config) {
      if (!dataset.typed) {
        return dataset;
      }
      const count = _getGraphemeCount(dataset.value);
      if (count < this.requirement) {
        _addIssue(this, 'grapheme_count', dataset, config, {
          received: `${count}`,
        });
      }
      return dataset;
    },
  };
}
