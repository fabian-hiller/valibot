import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue, _getGraphemeCount } from '../../utils/index.ts';

/**
 * Max grapheme count issue type.
 */
export interface MaxGraphemeCountIssue<
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
  readonly type: 'max_grapheme_count';
  /**
   * The expected property.
   */
  readonly expected: `<=${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The maximum grapheme count.
   */
  readonly requirement: TRequirement;
}

/**
 * Max grapheme count action type.
 */
export interface MaxGraphemeCountAction<
  TInput extends string,
  TRequirement extends number,
  TMessage extends
  | ErrorMessage<MaxGraphemeCountIssue<TInput, TRequirement>>
  | undefined,
> extends BaseValidation<
  TInput,
  TInput,
  MaxGraphemeCountIssue<TInput, TRequirement>
> {
  /**
   * The action type.
   */
  readonly type: 'max_grapheme_count';
  /**
   * The action reference.
   */
  readonly reference: typeof maxGraphemeCount;
  /**
   * The expected property.
   */
  readonly expects: `<=${TRequirement}`;
  /**
   * The maximum grapheme count.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a max grapheme count validation action.
 *
 * @param requirement The maximum grapheme count.
 *
 * @returns A max grapheme count action.
 */
export function maxGraphemeCount<
  TInput extends string,
  const TRequirement extends number,
>(
  requirement: TRequirement,
): MaxGraphemeCountAction<TInput, TRequirement, undefined>;

/**
 * Creates a max grapheme count validation action.
 *
 * @param requirement The maximum grapheme count.
 * @param message The error message.
 *
 * @returns A max grapheme count action.
 */
export function maxGraphemeCount<
  TInput extends string,
  const TRequirement extends number,
  const TMessage extends
  | ErrorMessage<MaxGraphemeCountIssue<TInput, TRequirement>>
  | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): MaxGraphemeCountAction<TInput, TRequirement, TMessage>;

export function maxGraphemeCount(
  requirement: number,
  message?: ErrorMessage<MaxGraphemeCountIssue<string, number>>
): MaxGraphemeCountAction<
  string,
  number,
  ErrorMessage<MaxGraphemeCountIssue<string, number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'max_grapheme_count',
    reference: maxGraphemeCount,
    async: false,
    expects: `<=${requirement}`,
    requirement,
    message,
    _run(dataset, config) {
      if (!dataset.typed) {
        return dataset;
      }
      const count = _getGraphemeCount(dataset.value);
      if (count > this.requirement) {
        _addIssue(this, 'grapheme_count', dataset, config, {
          received: `${count}`,
        });
      }
      return dataset;
    },
  };
}
