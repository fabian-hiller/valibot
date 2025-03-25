import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Max properties issue interface.
 */
export interface MaxPropsIssue<
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
  readonly type: 'max_properties';
  /**
   * The expected property.
   */
  readonly expected: `<=${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The maximum properties count.
   */
  readonly requirement: TRequirement;
}

/**
 * Max properties action interface.
 */
export interface MaxPropsAction<
  TInput extends object,
  TRequirement extends number,
  TMessage extends
    | ErrorMessage<MaxPropsIssue<TInput, TRequirement>>
    | undefined,
> extends BaseValidation<TInput, TInput, MaxPropsIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: 'max_properties';
  /**
   * The action reference.
   */
  readonly reference: typeof maxProps;
  /**
   * The expected property.
   */
  readonly expects: `<=${TRequirement}`;
  /**
   * The maximum properties count.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a max properties validation action.
 *
 * @param requirement The maximum properties count.
 *
 * @returns A max properties action.
 */
export function maxProps<
  TInput extends object,
  const TRequirement extends number,
>(requirement: TRequirement): MaxPropsAction<TInput, TRequirement, undefined>;

/**
 * Creates a max properties validation action.
 *
 * @param requirement The maximum properties count.
 * @param message The error message.
 *
 * @returns A max properties action.
 */
export function maxProps<
  TInput extends object,
  const TRequirement extends number,
  const TMessage extends
    | ErrorMessage<MaxPropsIssue<TInput, TRequirement>>
    | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): MaxPropsAction<TInput, TRequirement, TMessage>;

// @__NO_SIDE_EFFECTS__
export function maxProps(
  requirement: number,
  message?: ErrorMessage<MaxPropsIssue<object, number>>
): MaxPropsAction<
object,
  number,
  ErrorMessage<MaxPropsIssue<object, number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'max_properties',
    reference: maxProps,
    async: false,
    expects: `<=${requirement}`,
    requirement,
    message,
    '~run'(dataset, config) {
      if (!dataset.typed) return dataset;
      const propertiesCount = Object.keys(dataset.value).length;
      if (dataset.typed && propertiesCount > this.requirement) {
        _addIssue(this, 'properties', dataset, config, {
          received: `${propertiesCount}`,
        });
      }
      return dataset;
    },
  };
}
