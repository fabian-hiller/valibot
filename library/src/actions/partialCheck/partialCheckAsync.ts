import type {
  BaseValidationAsync,
  DeepPickN,
  ErrorMessage,
  MaybePromise,
  PathKeys,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { PartialCheckIssue, PartialInput } from './types.ts';
import { _isPartiallyTyped } from './utils/index.ts';

/**
 * Partial check action async type.
 */
export interface PartialCheckActionAsync<
  TInput extends PartialInput,
  TPathList extends readonly PathKeys<TInput>[],
  TSelection extends DeepPickN<TInput, TPathList>,
  TMessage extends ErrorMessage<PartialCheckIssue<TSelection>> | undefined,
> extends BaseValidationAsync<TInput, TInput, PartialCheckIssue<TSelection>> {
  /**
   * The action type.
   */
  readonly type: 'partial_check';
  /**
   * The action reference.
   */
  readonly reference: typeof partialCheckAsync;
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
  readonly requirement: (input: TSelection) => MaybePromise<boolean>;
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
export function partialCheckAsync<
  TInput extends PartialInput,
  const TPathList extends readonly PathKeys<TInput>[],
  const TSelection extends DeepPickN<TInput, TPathList>,
>(
  pathList: TPathList,
  requirement: (input: TSelection) => MaybePromise<boolean>
): PartialCheckActionAsync<TInput, TPathList, TSelection, undefined>;

/**
 * Creates a partial check validation action.
 *
 * @param pathList The selected paths.
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A partial check action.
 */
export function partialCheckAsync<
  TInput extends PartialInput,
  const TPathList extends readonly PathKeys<TInput>[],
  const TSelection extends DeepPickN<TInput, TPathList>,
  const TMessage extends
    | ErrorMessage<PartialCheckIssue<TSelection>>
    | undefined,
>(
  pathList: TPathList,
  requirement: (input: TSelection) => MaybePromise<boolean>,
  message: TMessage
): PartialCheckActionAsync<TInput, TPathList, TSelection, TMessage>;

export function partialCheckAsync(
  pathList: PathKeys<PartialInput>[],
  requirement: (input: PartialInput) => MaybePromise<boolean>,
  message?: ErrorMessage<PartialCheckIssue<PartialInput>>
): PartialCheckActionAsync<
  PartialInput,
  PathKeys<PartialInput>[],
  PartialInput,
  ErrorMessage<PartialCheckIssue<PartialInput>> | undefined
> {
  return {
    kind: 'validation',
    type: 'partial_check',
    reference: partialCheckAsync,
    async: true,
    expects: null,
    pathList,
    requirement,
    message,
    async '~run'(dataset, config) {
      if (
        _isPartiallyTyped(dataset, pathList) &&
        // @ts-expect-error
        !(await this.requirement(dataset.value))
      ) {
        _addIssue(this, 'input', dataset, config);
      }
      return dataset;
    },
  };
}
