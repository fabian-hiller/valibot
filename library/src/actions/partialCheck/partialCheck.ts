import type {
  BaseValidation,
  DeepPickN,
  ErrorMessage,
  PathKeys,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { PartialCheckIssue, PartialInput } from './types.ts';
import { _isPartiallyTyped } from './utils/index.ts';

/**
 * Partial check action type.
 */
export interface PartialCheckAction<
  TInput extends PartialInput,
  TPathList extends readonly PathKeys<TInput>[],
  TSelection extends DeepPickN<TInput, TPathList>,
  TMessage extends ErrorMessage<PartialCheckIssue<TSelection>> | undefined,
> extends BaseValidation<TInput, TInput, PartialCheckIssue<TSelection>> {
  /**
   * The action type.
   */
  readonly type: 'partial_check';
  /**
   * The action reference.
   */
  readonly reference: typeof partialCheck;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The selected paths.
   */
  readonly pathList: TPathList;
  /**
   * The validation function.
   */
  readonly requirement: (input: TSelection) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a partial check validation action.
 *
 * @param pathList The selected paths.
 * @param requirement The validation function.
 *
 * @returns A partial check action.
 */
export function partialCheck<
  TInput extends PartialInput,
  const TPathList extends readonly PathKeys<TInput>[],
  const TSelection extends DeepPickN<TInput, TPathList>,
>(
  pathList: TPathList,
  requirement: (input: TSelection) => boolean
): PartialCheckAction<TInput, TPathList, TSelection, undefined>;

/**
 * Creates a partial check validation action.
 *
 * @param pathList The selected paths.
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A partial check action.
 */
export function partialCheck<
  TInput extends PartialInput,
  const TPathList extends readonly PathKeys<TInput>[],
  const TSelection extends DeepPickN<TInput, TPathList>,
  const TMessage extends
    | ErrorMessage<PartialCheckIssue<TSelection>>
    | undefined,
>(
  pathList: TPathList,
  requirement: (input: TSelection) => boolean,
  message: TMessage
): PartialCheckAction<TInput, TPathList, TSelection, TMessage>;

// @__NO_SIDE_EFFECTS__
export function partialCheck(
  pathList: PathKeys<PartialInput>[],
  requirement: (input: PartialInput) => boolean,
  message?: ErrorMessage<PartialCheckIssue<PartialInput>>
): PartialCheckAction<
  PartialInput,
  PathKeys<PartialInput>[],
  PartialInput,
  ErrorMessage<PartialCheckIssue<PartialInput>> | undefined
> {
  return {
    kind: 'validation',
    type: 'partial_check',
    reference: partialCheck,
    async: false,
    expects: null,
    pathList,
    requirement,
    message,
    '~run'(dataset, config) {
      if (
        _isPartiallyTyped(dataset, pathList) &&
        // @ts-expect-error
        !this.requirement(dataset.value)
      ) {
        _addIssue(this, 'input', dataset, config);
      }
      return dataset;
    },
  };
}
