import type {
  ArrayPathItem,
  BaseIssue,
  BaseSchema,
  Dataset,
  ErrorMessage,
  InferInput,
  InferIssue,
  InferOutput,
  InferTupleInput,
  InferTupleIssue,
  InferTupleOutput,
  TupleItems,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { TupleWithRestIssue } from './types.ts';

/**
 * Tuple with rest schema type.
 */
export interface TupleWithRestSchema<
  TItems extends TupleItems,
  TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<TupleWithRestIssue> | undefined,
> extends BaseSchema<
    [...InferTupleInput<TItems>, ...InferInput<TRest>[]],
    [...InferTupleOutput<TItems>, ...InferOutput<TRest>[]],
    TupleWithRestIssue | InferTupleIssue<TItems> | InferIssue<TRest>
  > {
  /**
   * The schema type.
   */
  readonly type: 'tuple_with_rest';
  /**
   * The schema reference.
   */
  readonly reference: typeof tupleWithRest;
  /**
   * The expected property.
   */
  readonly expects: 'Array';
  /**
   * The items schema.
   */
  readonly items: TItems;
  /**
   * The rest schema.
   */
  readonly rest: TRest;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a tuple with rest schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 *
 * @returns A tuple with rest schema.
 */
export function tupleWithRest<
  const TItems extends TupleItems,
  const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(items: TItems, rest: TRest): TupleWithRestSchema<TItems, TRest, undefined>;

/**
 * Creates a tuple with rest schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param message The error message.
 *
 * @returns A tuple with rest schema.
 */
export function tupleWithRest<
  const TItems extends TupleItems,
  const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  const TMessage extends ErrorMessage<TupleWithRestIssue> | undefined,
>(
  items: TItems,
  rest: TRest,
  message: TMessage
): TupleWithRestSchema<TItems, TRest, TMessage>;

export function tupleWithRest(
  items: TupleItems,
  rest: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  message?: ErrorMessage<TupleWithRestIssue>
): TupleWithRestSchema<
  TupleItems,
  BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  ErrorMessage<TupleWithRestIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'tuple_with_rest',
    reference: tupleWithRest,
    expects: 'Array',
    async: false,
    items,
    rest,
    message,
    _run(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (Array.isArray(input)) {
        // Set typed to `true` and value to empty array
        dataset.typed = true;
        dataset.value = [];

        // Parse schema of each tuple item
        for (let key = 0; key < this.items.length; key++) {
          const value = input[key];
          const itemDataset = this.items[key]._run(
            { typed: false, value },
            config
          );

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

        // Parse rest with schema if necessary
        if (!dataset.issues || !config.abortEarly) {
          for (let key = this.items.length; key < input.length; key++) {
            const value = input[key];
            const itemDataset = this.rest._run({ typed: false, value }, config);

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
        }

        // Otherwise, add tuple issue
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // Return output dataset
      return dataset as Dataset<
        unknown[],
        TupleWithRestIssue | BaseIssue<unknown>
      >;
    },
  };
}
