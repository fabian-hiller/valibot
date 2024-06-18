import type {
  BaseValidation,
  DeepPickN,
  ErrorMessage,
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
 * Partial check action type.
 */
// @ts-ignore
export interface PartialCheckAction<
  TInput extends Input,
  TPathList extends readonly PathKeys<TInput>[],
  TMessage extends
    | ErrorMessage<PartialCheckIssue<DeepPickN<TInput, TPathList>>>
    | undefined,
> extends BaseValidation<
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
  readonly reference: typeof partialCheck;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: DeepPickN<TInput, TPathList>) => boolean;
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
  TInput extends Input,
  const TPathList extends readonly PathKeys<TInput>[],
>(
  pathList: TPathList,
  requirement: (input: DeepPickN<TInput, TPathList>) => boolean
): PartialCheckAction<TInput, TPathList, undefined>;

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
  TInput extends Input,
  const TPathList extends readonly PathKeys<TInput>[],
  const TMessage extends
    | ErrorMessage<PartialCheckIssue<DeepPickN<TInput, TPathList>>>
    | undefined,
>(
  pathList: TPathList,
  requirement: (input: DeepPickN<TInput, TPathList>) => boolean,
  message: TMessage
): PartialCheckAction<TInput, TPathList, TMessage>;

export function partialCheck(
  pathList: ([string] | [number])[],
  requirement: (input: Input) => boolean,
  message?: ErrorMessage<PartialCheckIssue<never>>
): PartialCheckAction<
  Input,
  ([string] | [number])[],
  ErrorMessage<PartialCheckIssue<never>> | undefined
> {
  return {
    kind: 'validation',
    type: 'partial_check',
    reference: partialCheck,
    async: false,
    expects: null,
    requirement,
    message,
    _run(dataset, config) {
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
