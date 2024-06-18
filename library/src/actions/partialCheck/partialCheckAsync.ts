import type {
  BaseValidationAsync,
  DeepPickN,
  ErrorMessage,
  MaybePromise,
  PathKeys,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { PartialCheckIssue } from './types.ts';
import { _isPartiallyTyped } from './utils/index.ts';

/**
 * Input type.
 */
type Input = Record<string, unknown> | readonly unknown[];

/**
 * Partial check action async type.
 */
// @ts-ignore
export interface PartialCheckActionAsync<
  TInput extends Input,
  TPathList extends readonly PathKeys<TInput>[],
  TMessage extends
    | ErrorMessage<PartialCheckIssue<DeepPickN<TInput, TPathList>>>
    | undefined,
> extends BaseValidationAsync<
    TInput,
    TInput,
    PartialCheckIssue<DeepPickN<TInput, TPathList>>
  > {
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
   * The validation function.
   */
  readonly requirement: (
    input: DeepPickN<TInput, TPathList>
  ) => MaybePromise<boolean>;
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
  TInput extends Input,
  const TPathList extends readonly PathKeys<TInput>[],
>(
  pathList: TPathList,
  requirement: (input: DeepPickN<TInput, TPathList>) => MaybePromise<boolean>
): PartialCheckActionAsync<TInput, TPathList, undefined>;

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
  TInput extends Input,
  const TPathList extends readonly PathKeys<TInput>[],
  const TMessage extends
    | ErrorMessage<PartialCheckIssue<DeepPickN<TInput, TPathList>>>
    | undefined,
>(
  pathList: TPathList,
  requirement: (input: DeepPickN<TInput, TPathList>) => MaybePromise<boolean>,
  message: TMessage
): PartialCheckActionAsync<TInput, TPathList, TMessage>;

export function partialCheckAsync(
  pathList: ([string] | [number])[],
  requirement: (input: Input) => MaybePromise<boolean>,
  message?: ErrorMessage<PartialCheckIssue<never>>
): PartialCheckActionAsync<
  Input,
  ([string] | [number])[],
  ErrorMessage<PartialCheckIssue<never>> | undefined
> {
  return {
    kind: 'validation',
    type: 'partial_check',
    reference: partialCheckAsync,
    async: true,
    expects: null,
    requirement,
    message,
    async _run(dataset, config) {
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
