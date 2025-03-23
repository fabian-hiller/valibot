import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Min properties issue interface.
 */
export interface MinPropsIssue<
  TInput extends object,
  TRequirement extends number,
> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'min_properties';
  /**
   * The expected property.
   */
  readonly expected: `>=${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The minimum properties count.
   */
  readonly requirement: TRequirement;
}

/**
 * Min properties action interface.
 */
export interface MinPropsAction<
  TInput extends object,
  TRequirement extends number,
  TMessage extends
    | ErrorMessage<MinPropsIssue<TInput, TRequirement>>
    | undefined,
> extends BaseValidation<TInput, TInput, MinPropsIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: 'min_properties';
  /**
   * The action reference.
   */
  readonly reference: typeof minProps;
  /**
   * The expected property.
   */
  readonly expects: `>=${TRequirement}`;
  /**
   * The minimum properties count.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a min properties validation action.
 *
 * @param requirement The minimum properties count.
 *
 * @returns A min properties action.
 */
export function minProps<
  TInput extends object,
  const TRequirement extends number,
>(requirement: TRequirement): MinPropsAction<TInput, TRequirement, undefined>;

/**
 * Creates a min properties validation action.
 *
 * @param requirement The minimum properties count.
 * @param message The error message.
 *
 * @returns A min properties action.
 */
export function minProps<
  TInput extends object,
  const TRequirement extends number,
  const TMessage extends
    | ErrorMessage<MinPropsIssue<TInput, TRequirement>>
    | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): MinPropsAction<TInput, TRequirement, TMessage>;

// @__NO_SIDE_EFFECTS__
export function minProps(
  requirement: number,
  message?: ErrorMessage<MinPropsIssue<object, number>>
): MinPropsAction<
object,
  number,
  ErrorMessage<MinPropsIssue<object, number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'min_properties',
    reference: minProps,
    async: false,
    expects: `>=${requirement}`,
    requirement,
    message,
    '~run'(dataset, config) {
      if (!dataset.typed) return dataset;
      const propertiesCount = Object.keys(dataset.value).length;
      if (dataset.typed && propertiesCount < this.requirement) {
        _addIssue(this, 'properties', dataset, config, {
          received: `${propertiesCount}`,
        });
      }
      return dataset;
    },
  };
}
