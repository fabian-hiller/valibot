import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue, _getDigitCount } from '../../utils/index.ts';

/**
 * Min digits issue interface.
 */
export interface MinDigitsIssue<
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
  readonly type: 'min_digits';
  /**
   * The expected property.
   */
  readonly expected: `>=${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The minimum digits.
   */
  readonly requirement: TRequirement;
}

/**
 * Min digits action interface.
 */
export interface MinDigitsAction<
  TInput extends string,
  TRequirement extends number,
  TMessage extends
    | ErrorMessage<MinDigitsIssue<TInput, TRequirement>>
    | undefined,
> extends BaseValidation<TInput, TInput, MinDigitsIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: 'min_digits';
  /**
   * The action reference.
   */
  readonly reference: typeof minDigits;
  /**
   * The expected property.
   */
  readonly expects: `>=${TRequirement}`;
  /**
   * The minimum digits.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a min digits validation action.
 *
 * @param requirement The minimum digits.
 *
 * @returns A min digits action.
 */
export function minDigits<
  TInput extends string,
  const TRequirement extends number,
>(requirement: TRequirement): MinDigitsAction<TInput, TRequirement, undefined>;

/**
 * Creates a min digits validation action.
 *
 * @param requirement The minimum digits.
 * @param message The error message.
 *
 * @returns A min digits action.
 */
export function minDigits<
  TInput extends string,
  const TRequirement extends number,
  const TMessage extends
    | ErrorMessage<MinDigitsIssue<TInput, TRequirement>>
    | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): MinDigitsAction<TInput, TRequirement, TMessage>;

// @__NO_SIDE_EFFECTS__
export function minDigits(
  requirement: number,
  message?: ErrorMessage<MinDigitsIssue<string, number>>
): MinDigitsAction<
  string,
  number,
  ErrorMessage<MinDigitsIssue<string, number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'min_digits',
    reference: minDigits,
    async: false,
    expects: `>=${requirement}`,
    requirement,
    message,
    '~run'(dataset, config) {
      if (dataset.typed) {
        const count = _getDigitCount(dataset.value);
        if (count < this.requirement) {
          _addIssue(this, 'digits', dataset, config, {
            received: `${count}`,
          });
        }
      }
      return dataset;
    },
  };
}
