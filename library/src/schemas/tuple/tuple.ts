import type {
  BaseIssue,
  BaseSchema,
  Dataset,
  ErrorMessage,
  InferTupleInput,
  InferTupleIssue,
  InferTupleOutput,
  TupleItems,
  TuplePathItem,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { TupleIssue } from './types.ts';

/**
 * Tuple schema type.
 */
export interface TupleSchema<
  TItems extends TupleItems,
  TMessage extends ErrorMessage<TupleIssue> | undefined,
> extends BaseSchema<
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
  readonly reference: typeof tuple;
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
 * @param items The items schema.
 *
 * @returns A tuple schema.
 */
export function tuple<const TItems extends TupleItems>(
  items: TItems
): TupleSchema<TItems, undefined>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param message The error message.
 *
 * @returns A tuple schema.
 */
export function tuple<
  const TItems extends TupleItems,
  const TMessage extends ErrorMessage<TupleIssue> | undefined,
>(items: TItems, message: TMessage): TupleSchema<TItems, TMessage>;

export function tuple(
  items: TupleItems,
  message?: ErrorMessage<TupleIssue>
): TupleSchema<TupleItems, ErrorMessage<TupleIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'tuple',
    reference: tuple,
    expects: 'Array',
    async: false,
    items,
    message,
    _run(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (Array.isArray(input)) {
        // Set typed to true and value to empty array
        dataset.typed = true;
        dataset.value = [];

        // Parse schema of each tuple item
        for (let key = 0; key < items.length; key++) {
          const value = input[key];
          const itemDataset = this.items[key]._run(
            { typed: false, value },
            config
          );

          // If there are issues, capture them
          if (itemDataset.issues) {
            // Create tuple path item
            const pathItem: TuplePathItem = {
              type: 'tuple',
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

          // If not typed, set typed to false
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
