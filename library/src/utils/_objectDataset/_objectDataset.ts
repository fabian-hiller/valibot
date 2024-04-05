import type {
  LooseObjectIssue,
  LooseObjectSchema,
  NeverIssue,
  ObjectIssue,
  ObjectSchema,
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
  FunctionReference,
  InferIssue,
  InferOutput,
  ObjectEntries,
  ObjectPathItem,
} from '../../types/index.ts';
import { _addIssue } from '../_addIssue/index.ts';
import type { _addObjectRestIssues } from '../_addObjectRestIssues/index.ts';

// Create object entries cache
const cache: Map<
  ObjectEntries,
  [string, BaseSchema<unknown, unknown, BaseIssue<unknown>>][]
> = new Map();

/**
 * Returns the output dataset of an object schema.
 *
 * @param context The schema context.
 * @param reference The schema reference.
 * @param dataset The input dataset.
 * @param config The configuration.
 *
 * @returns The output dataset.
 *
 * @internal
 */
export function _objectDataset<
  const TSchema extends ObjectSchema<
    ObjectEntries,
    ErrorMessage<ObjectIssue> | undefined
  >,
>(
  context: TSchema,
  reference: FunctionReference<unknown[], TSchema>,
  dataset: Dataset<unknown, never>,
  config: Config<InferIssue<TSchema>>
): Dataset<InferOutput<TSchema>, InferIssue<TSchema>>;

/**
 * Returns the output dataset of an object schema.
 *
 * @param context The schema context.
 * @param reference The schema reference.
 * @param dataset The input dataset.
 * @param config The configuration.
 * @param addRestIssues The _addObjectRestIssues util.
 *
 * @returns The output dataset.
 *
 * @internal
 */
export function _objectDataset<
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
  reference: FunctionReference<unknown[], TSchema>,
  dataset: Dataset<unknown, never>,
  config: Config<InferIssue<TSchema>>,
  addRestIssues: typeof _addObjectRestIssues
): Dataset<InferOutput<TSchema>, InferIssue<TSchema>>;

export function _objectDataset<
  const TSchema extends
    | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
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
  reference: FunctionReference<unknown[], TSchema>,
  dataset: Dataset<unknown, never>,
  config: Config<InferIssue<TSchema>>,
  addRestIssues?: typeof _addObjectRestIssues
): Dataset<InferOutput<TSchema>, InferIssue<TSchema>> {
  // Get input value from dataset
  const input = dataset.value;

  // If root type is valid, check nested types
  if (input && typeof input === 'object' && input.constructor === Object) {
    // Cache object entries lazy
    const entries =
      cache.get(context.entries) ??
      cache
        .set(context.entries, Object.entries(context.entries))
        .get(context.entries)!;

    // Set typed to true and value to blank object
    dataset.typed = true;
    dataset.value = {};

    // Parse schema of each entry
    for (const [key, schema] of entries) {
      const value = (input as Record<string, unknown>)[key];
      const entryDataset = schema._run({ typed: false, value }, config);

      // If there are issues, capture them
      if (entryDataset.issues) {
        // Create object path item
        const pathItem: ObjectPathItem = {
          type: 'object',
          origin: 'value',
          input: input as Record<string, unknown>,
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
          // @ts-expect-error
          dataset.issues?.push(issue);
        }
        if (!dataset.issues) {
          // @ts-expect-error
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

      // Add entry to dataset if necessary
      if (entryDataset.value !== undefined || key in input) {
        // @ts-expect-error
        dataset.value[key] = entryDataset.value;
      }
    }

    // Add rest issues if necessary
    // @ts-expect-error
    addRestIssues?.(context, input, dataset, config);

    // Otherwise, add object issue
  } else {
    _addIssue(context, reference, 'type', dataset, config);
  }

  // Return output dataset
  return dataset as Dataset<InferOutput<TSchema>, InferIssue<TSchema>>;
}
