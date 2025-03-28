import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Min props issue interface.
 */
export interface MinPropsIssue<
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
  readonly type: 'min_props';
  /**
   * The expected property.
   */
  readonly expected: `>=${TRequirement}`;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The minimum properties.
   */
  readonly requirement: TRequirement;
}

/**
 * Min props action interface.
 */
export interface MinPropsAction<
  TInput extends Record<string, unknown>,
  TRequirement extends number,
  TMessage extends
    | ErrorMessage<MinPropsIssue<TInput, TRequirement>>
    | undefined,
> extends BaseValidation<TInput, TInput, MinPropsIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: 'min_props';
  /**
   * The action reference.
   */
  readonly reference: typeof minProps;
  /**
   * The expected property.
   */
  readonly expects: `>=${TRequirement}`;
  /**
   * The minimum properties.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a min props validation action.
 *
 * @param requirement The minimum properties.
 *
 * @returns A min props action.
 */
export function minProps<
  TInput extends Record<string, unknown>,
  const TRequirement extends number,
>(requirement: TRequirement): MinPropsAction<TInput, TRequirement, undefined>;

/**
 * Creates a min props validation action.
 *
 * @param requirement The minimum properties.
 * @param message The error message.
 *
 * @returns A min props action.
 */
export function minProps<
  TInput extends Record<string, unknown>,
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
  message?: ErrorMessage<MinPropsIssue<Record<string, unknown>, number>>
): MinPropsAction<
  Record<string, unknown>,
  number,
  ErrorMessage<MinPropsIssue<Record<string, unknown>, number>> | undefined
> {
  return {
    kind: 'validation',
    type: 'min_props',
    reference: minProps,
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
