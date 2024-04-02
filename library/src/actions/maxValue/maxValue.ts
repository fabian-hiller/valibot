import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue, _stringify } from '../../utils/index.ts';
import type { ValueInput } from '../types.ts';

/**
 * Max value issue type.
 */
export interface MaxValueIssue<
  TInput extends ValueInput,
  TRequirement extends ValueInput,
> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'max_value';
  /**
   * The expected input.
   */
  readonly expected: `<=${string}`;
  /**
   * The maximum value.
   */
  readonly requirement: TRequirement;
}

/**
 * Max value validation type.
 */
export interface MaxValueValidation<
  TInput extends ValueInput,
  TRequirement extends TInput,
  TMessage extends
    | ErrorMessage<MaxValueIssue<TInput, TRequirement>>
    | undefined,
> extends BaseValidation<TInput, TInput, MaxValueIssue<TInput, TRequirement>> {
  /**
   * The validation type.
   */
  readonly type: 'max_value';
  /**
   * The expected property.
   */
  readonly expects: `<=${string}`;
  /**
   * The maximum value.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a pipeline validation action that validates the value of a string,
 * number, boolean or date.
 *
 * @param requirement The maximum value.
 *
 * @returns A validation action.
 */
export function maxValue<
  TInput extends ValueInput,
  const TRequirement extends TInput,
>(
  requirement: TRequirement
): MaxValueValidation<TInput, TRequirement, undefined>;

/**
 * Creates a pipeline validation action that validates the value of a string,
 * number, boolean or date.
 *
 * @param requirement The maximum value.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function maxValue<
  TInput extends ValueInput,
  const TRequirement extends TInput,
  const TMessage extends
    | ErrorMessage<MaxValueIssue<TInput, TRequirement>>
    | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): MaxValueValidation<TInput, TRequirement, TMessage>;

export function maxValue(
  requirement: ValueInput,
  message?: ErrorMessage<MaxValueIssue<ValueInput, ValueInput>>
): MaxValueValidation<
  ValueInput,
  ValueInput,
  ErrorMessage<MaxValueIssue<ValueInput, ValueInput>> | undefined
> {
  return {
    kind: 'validation',
    type: 'max_value',
    expects: `<=${
      requirement instanceof Date
        ? requirement.toJSON()
        : _stringify(requirement)
    }`,
    async: false,
    message,
    requirement,
    _run(dataset, config) {
      if (dataset.typed && dataset.value > this.requirement) {
        _addIssue(this, maxValue, 'value', dataset, config, {
          received:
            dataset.value instanceof Date
              ? dataset.value.toJSON()
              : _stringify(dataset.value),
        });
      }
      return dataset;
    },
  };
}
