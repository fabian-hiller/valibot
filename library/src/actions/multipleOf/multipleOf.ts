import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Multiple of issue type.
 */
export interface MultipleOfIssue<
  TInput extends number,
  TRequirement extends number,
> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'multiple_of';
  /**
   * The expected property.
   */
  readonly expected: `%${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The divisor.
   */
  readonly requirement: TRequirement;
}

/**
 * Multiple of action type.
 */
export interface MultipleOfAction<
  TInput extends number,
  TRequirement extends number,
  TMessage extends
    | ErrorMessage<MultipleOfIssue<TInput, TRequirement>>
    | undefined,
> extends BaseValidation<
    TInput,
    TInput,
    MultipleOfIssue<TInput, TRequirement>
  > {
  /**
   * The action type.
   */
  readonly type: 'multiple_of';
  /**
   * The action reference.
   */
  readonly reference: typeof multipleOf;
  /**
   * The expected property.
   */
  readonly expects: `%${TRequirement}`;
  /**
   * The divisor.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [multiple](https://en.wikipedia.org/wiki/Multiple_(mathematics)) of validation action.
 *
 * @param requirement The divisor.
 *
 * @returns A multiple of action.
 */
export function multipleOf<
  TInput extends number,
  const TRequirement extends number,
>(requirement: TRequirement): MultipleOfAction<TInput, TRequirement, undefined>;

/**
 * Creates a [multiple](https://en.wikipedia.org/wiki/Multiple_(mathematics)) of validation action.
 *
 * @param requirement The divisor.
 * @param message The error message.
 *
 * @returns A multiple of action.
 */
export function multipleOf<
  TInput extends number,
  const TRequirement extends number,
  const TMessage extends
    | ErrorMessage<MultipleOfIssue<TInput, TRequirement>>
    | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): MultipleOfAction<TInput, TRequirement, TMessage>;

// @__NO_SIDE_EFFECTS__
export function multipleOf(
  requirement: number,
  message?: ErrorMessage<MultipleOfIssue<number, number>>
): MultipleOfAction<
  number,
  number,
  ErrorMessage<MultipleOfIssue<number, number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'multiple_of',
    reference: multipleOf,
    async: false,
    expects: `%${requirement}`,
    requirement,
    message,
    '~run'(dataset, config) {
      if (dataset.typed && dataset.value % this.requirement !== 0) {
        _addIssue(this, 'multiple', dataset, config);
      }
      return dataset;
    },
  };
}
