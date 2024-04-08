import type {
  LooseObjectIssue,
  LooseObjectSchema,
  NeverIssue,
  ObjectWithRestIssue,
  ObjectWithRestSchema,
  StrictObjectIssue,
  StrictObjectSchema,
} from '../../schemas/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  Config,
  Dataset,
  ErrorMessage,
  InferIssue,
  InferOutput,
  ObjectEntries,
  ObjectPathItem,
} from '../../types/index.ts';

/**
 * Adds object rest issues to the dataset.
 *
 * @param context The schema context.
 * @param input The raw input data.
 * @param dataset The input dataset.
 * @param config The configuration.
 *
 * @internal
 */
export function _addObjectRestIssues<
  const TSchema extends
    | ObjectWithRestSchema<
        ObjectEntries,
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        ErrorMessage<ObjectWithRestIssue> | undefined
      >
    | StrictObjectSchema<
        ObjectEntries,
        ErrorMessage<StrictObjectIssue | NeverIssue> | undefined
      >
    | LooseObjectSchema<
        ObjectEntries,
        ErrorMessage<LooseObjectIssue> | undefined
      >,
>(
  context: TSchema,
  input: Record<string, unknown>,
  dataset: Dataset<InferOutput<TSchema>, InferIssue<TSchema>>,
  config: Config<InferIssue<TSchema>>
): void {
  if (!dataset.issues || !config.abortEarly) {
    for (const key in input) {
      if (!(key in context.entries)) {
        const value = input[key];
        const entryDataset = context.rest._run({ typed: false, value }, config);

        // If there are issues, capture them
        if (entryDataset.issues) {
          // Create object path item
          const pathItem: ObjectPathItem = {
            type: 'object',
            origin: 'value',
            input,
            key,
            value,
          };

          // Add modified entry dataset issues to issues
          for (const issue of entryDataset.issues) {
            if (issue.path) {
              issue.path.unshift(pathItem);
            } else {
              // @ts-expect-error
              issue.path = [pathItem];
            }
            dataset.issues?.push(issue);
          }
          if (!dataset.issues) {
            dataset.issues = entryDataset.issues;
          }

          // If necessary, abort early
          if (config.abortEarly) {
            dataset.typed = false;
            break;
          }
        }

        // If not typed, set typed to false
        if (!entryDataset.typed) {
          dataset.typed = false;
        }

        // Add entry to dataset
        // @ts-expect-error
        dataset.value[key] = entryDataset.value;
      }
    }
  }
}
