import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Max props issue interface.
 */
export interface MaxPropsIssue<
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
  readonly type: 'max_props';
  /**
   * The expected property.
   */
  readonly expected: `<=${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The maximum properties.
   */
  readonly requirement: TRequirement;
}

/**
 * Max props action interface.
 */
export interface MaxPropsAction<
  TInput extends Record<string, unknown>,
  TRequirement extends number,
  TMessage extends
    | ErrorMessage<MaxPropsIssue<TInput, TRequirement>>
    | undefined,
> extends BaseValidation<TInput, TInput, MaxPropsIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: 'max_props';
  /**
   * The action reference.
   */
  readonly reference: typeof maxProps;
  /**
   * The expected property.
   */
  readonly expects: `<=${TRequirement}`;
  /**
   * The maximum properties.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a max props validation action.
 *
 * @param requirement The maximum properties.
 *
 * @returns A max props action.
 */
export function maxProps<
  TInput extends Record<string, unknown>,
  const TRequirement extends number,
>(requirement: TRequirement): MaxPropsAction<TInput, TRequirement, undefined>;

/**
 * Creates a max props validation action.
 *
 * @param requirement The maximum properties.
 * @param message The error message.
 *
 * @returns A max props action.
 */
export function maxProps<
  TInput extends Record<string, unknown>,
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
  message?: ErrorMessage<MaxPropsIssue<Record<string, unknown>, number>>
): MaxPropsAction<
  Record<string, unknown>,
  number,
  ErrorMessage<MaxPropsIssue<Record<string, unknown>, number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'max_props',
    reference: maxProps,
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
