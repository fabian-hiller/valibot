import type {
  BaseIssue,
  BaseSchema,
  Config,
  Dataset,
  FunctionReference,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import { _addIssue } from '../_addIssue/index.ts';

/**
 * Returns the output dataset of a primitive schema.
 *
 * @param context The schema context.
 * @param reference The schema reference.
 * @param typed Whether its typed.
 * @param dataset The input dataset.
 * @param config The configuration.
 *
 * @returns The output dataset.
 *
 * @internal
 */
export function _schemaDataset<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(
  context: TSchema,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reference: FunctionReference<any[], TSchema>,
  typed: boolean,
  dataset: Dataset<unknown, never>,
  config: Config<InferIssue<TSchema>>
): Dataset<InferOutput<TSchema>, InferIssue<TSchema>> {
  if (typed) {
    dataset.typed = true;
  } else {
    _addIssue(context, reference, 'type', dataset, config);
  }
  return dataset as Dataset<InferOutput<TSchema>, InferIssue<TSchema>>;
}
