import type {
  BaseIssue,
  BaseValidation,
  Config,
  Dataset,
  FunctionReference,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import { _addIssue } from '../_addIssue/index.ts';

/**
 * Returns the output dataset of a validation action.
 *
 * @param context The action context.
 * @param reference The action reference.
 * @param label The action label.
 * @param invalid Whether its invalid.
 * @param dataset The input dataset.
 * @param config The configuration.
 *
 * @returns The output dataset.
 *
 * @internal
 */
export function _validationDataset<
  const TAction extends BaseValidation<unknown, unknown, BaseIssue<unknown>>,
>(
  context: TAction,
  reference: FunctionReference<unknown[], TAction>,
  label: string,
  invalid: boolean,
  dataset: Dataset<InferInput<TAction>, BaseIssue<InferInput<TAction>>>,
  config: Config<InferIssue<TAction>>
): Dataset<
  InferOutput<TAction>,
  BaseIssue<InferInput<TAction>> | InferIssue<TAction>
> {
  if (invalid) {
    _addIssue(context, reference, label, dataset, config);
  }
  return dataset as Dataset<
    InferOutput<TAction>,
    BaseIssue<InferInput<TAction>> | InferIssue<TAction>
  >;
}
