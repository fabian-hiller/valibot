import type { BaseIssue, BaseValidation, ErrorMessage } from '../../types/index.ts';
import { _addIssue, _stringify } from '../../utils/index.ts';

type IncludesInput = string | unknown[];

type IncludesRequirement<TInput extends IncludesInput> =
  TInput extends unknown[] ? TInput[number] : TInput;

type IncludesType = 'includes';

/**
 * Includes issue type.
 */
export interface IncludesIssue<
  TInput extends IncludesInput,
  TRequirement extends IncludesRequirement<TInput>,
> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: IncludesType;
  /**
   * The expected input.
   */ 
  readonly expected: string;
  /**
   * The content to be included.
   */
  readonly requirement: TRequirement;
}

/**
 * Includes action type.
 */
export interface IncludesAction<
  TInput extends IncludesInput,
  TRequirement extends IncludesRequirement<TInput>,
  TMessage extends
    | ErrorMessage<IncludesIssue<TInput, TRequirement>>
    | undefined,
> extends BaseValidation<TInput, TInput, IncludesIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: IncludesType;
  /**
   * The expected property.
   */
  readonly expects: string;
  /**
   * The content to be included.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a pipeline validation action that validates the content of a string
 * or array.
 *
 * @param requirement The content to be included.
 *
 * @returns A validation action.
 */
export function includes<
  TInput extends IncludesInput,
  const TRequirement extends IncludesRequirement<TInput>,
>(requirement: TRequirement): IncludesAction<TInput, TRequirement, undefined>;

/**
 * Creates a pipeline validation action that validates the content of a string
 * or array.
 *
 * @param requirement The content to be included.
 * @param message The error message.
 * 
 * @returns A validation action.
 */
export function includes<
  TInput extends IncludesInput,
  const TRequirement extends IncludesRequirement<TInput>,
  const TMessage extends
    | ErrorMessage<IncludesIssue<TInput, TRequirement>>
    | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): IncludesAction<TInput, TRequirement, TMessage>;

export function includes<
  TInput extends IncludesInput,
  const TRequirement extends IncludesRequirement<TInput>
>(
  requirement: TRequirement,
  message?: ErrorMessage<IncludesIssue<TInput, TRequirement>>
): IncludesAction<
  TInput, 
  TRequirement, 
  ErrorMessage<IncludesIssue<TInput, TRequirement>> | undefined
> {
  const expects = _stringify(requirement);
  return {
    kind: 'validation',
    type: 'includes',
    async: false,
    expects,
    message,
    requirement,
    _run(dataset, config) {
      if (dataset.typed) {
        // Cannot execute: `dataset.value.includes(this.requirement)` without a compiler error. 
        // Reason: 
        //     `this.requirement` is assigned a type conditionally based on `TInput`.
        //     Even if `this.requirement` is not assigned a type conditionally, 
        //         `this.requrement` will be set to `unknown` as `TInput[number]` can be anything.
        // The old implementation worked because: type TRequirement = any | string = any

        // Safe hacky workaround: 
        //     `dataset.value.includes(this.requirement as IncludesRequirement<string>)`.
        // But bad for code readability

        // Preferred workaround: Smartly narrow the types before performing runtime checks.
        const datasetValue = dataset.value;
        let includesRequirement: boolean;
        if (Array.isArray(datasetValue)) {
          includesRequirement = datasetValue.includes(this.requirement);
        } 
        else if (typeof this.requirement === 'string') {
          includesRequirement = datasetValue.includes(this.requirement);
        } else {
          // Let the code register an issue for this unreachable block
          includesRequirement = false; 
        }
        if (!includesRequirement) {
          _addIssue(this, includes, 'content', dataset, config, { 
            received: `!${expects}` 
          });
        }
      }
      return dataset;
    },
  };
}
