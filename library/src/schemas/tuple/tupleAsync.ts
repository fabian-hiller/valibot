import type {
  ArrayPathItem,
  BaseIssue,
  BaseSchemaAsync,
  Dataset,
  ErrorMessage,
  InferTupleInput,
  InferTupleIssue,
  InferTupleOutput,
  TupleItemsAsync,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { TupleIssue } from './types.ts';

/**
 * Tuple schema async type.
 */
export interface TupleSchemaAsync<
  TItems extends TupleItemsAsync,
  TMessage extends ErrorMessage<TupleIssue> | undefined,
> extends BaseSchemaAsync<
    InferTupleInput<TItems>,
    InferTupleOutput<TItems>,
    TupleIssue | InferTupleIssue<TItems>
  > {
  /**
   * The schema type.
   */
  readonly type: 'tuple';
  /**
   * The schema reference.
   */
  readonly reference: typeof tupleAsync;
  /**
   * The expected property.
   */
  readonly expects: 'Array';
  /**
   * The items schema.
   */
  readonly items: TItems;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a tuple schema.
 *
 * Hint: This schema removes unknown items. The output will only include the
 * items you specify. To include unknown items, use `looseTupleAsync`. To
 * return an issue for unknown items, use `strictTupleAsync`. To include and
 * validate unknown items, use `tupleWithRestAsync`.
 *
 * @param items The items schema.
 *
 * @returns A tuple schema.
 */
export function tupleAsync<const TItems extends TupleItemsAsync>(
  items: TItems
): TupleSchemaAsync<TItems, undefined>;

/**
 * Creates a tuple schema.
 *
 * Hint: This schema removes unknown items. The output will only include the
 * items you specify. To include unknown items, use `looseTupleAsync`. To
 * return an issue for unknown items, use `strictTupleAsync`. To include and
 * validate unknown items, use `tupleWithRestAsync`.
 *
 * @param items The items schema.
 * @param message The error message.
 *
 * @returns A tuple schema.
 */
export function tupleAsync<
  const TItems extends TupleItemsAsync,
  const TMessage extends ErrorMessage<TupleIssue> | undefined,
>(items: TItems, message: TMessage): TupleSchemaAsync<TItems, TMessage>;

export function tupleAsync(
  items: TupleItemsAsync,
  message?: ErrorMessage<TupleIssue>
): TupleSchemaAsync<TupleItemsAsync, ErrorMessage<TupleIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'tuple',
    reference: tupleAsync,
    expects: 'Array',
    async: true,
    items,
    message,
    async _run(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (Array.isArray(input)) {
        // Set typed to `true` and value to empty array
        dataset.typed = true;
        dataset.value = [];

        // Parse schema of each tuple item
        const itemDatasets = await Promise.all(
          this.items.map(async (item, key) => {
            const value = input[key];
            return [
              key,
              value,
              await item._run({ typed: false, value }, config),
            ] as const;
          })
        );

        // Process each tuple item dataset
        for (const [key, value, itemDataset] of itemDatasets) {
          // If there are issues, capture them
          if (itemDataset.issues) {
            // Create tuple path item
            const pathItem: ArrayPathItem = {
              type: 'array',
              origin: 'value',
              input,
              key,
              value,
            };

            // Add modified item dataset issues to issues
            for (const issue of itemDataset.issues) {
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
              dataset.issues = itemDataset.issues;
            }

            // If necessary, abort early
            if (config.abortEarly) {
              dataset.typed = false;
              break;
            }
          }

          // If not typed, set typed to `false`
          if (!itemDataset.typed) {
            dataset.typed = false;
          }

          // Add item to dataset
          // @ts-expect-error
          dataset.value.push(itemDataset.value);
        }

        // Otherwise, add tuple issue
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // Return output dataset
      return dataset as Dataset<unknown[], TupleIssue | BaseIssue<unknown>>;
    },
  };
}
