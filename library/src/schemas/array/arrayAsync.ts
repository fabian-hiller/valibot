import type {
  ArrayPathItem,
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Dataset,
  ErrorMessage,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { ArrayIssue } from './types.ts';

/**
 * Array schema type.
 */
export interface ArraySchemaAsync<
  TItem extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<ArrayIssue> | undefined,
> extends BaseSchemaAsync<
    InferInput<TItem>[],
    InferOutput<TItem>[],
    ArrayIssue | InferIssue<TItem>
  > {
  /**
   * The schema type.
   */
  readonly type: 'array';
  /**
   * The schema reference.
   */
  readonly reference: typeof arrayAsync;
  /**
   * The expected property.
   */
  readonly expects: 'Array';
  /**
   * The array item schema.
   */
  readonly item: TItem;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an array schema.
 *
 * @param item The item schema.
 *
 * @returns An array schema.
 */
export function arrayAsync<
  const TItem extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(item: TItem): ArraySchemaAsync<TItem, undefined>;

/**
 * Creates an array schema.
 *
 * @param item The item schema.
 * @param message The error message.
 *
 * @returns An array schema.
 */
export function arrayAsync<
  const TItem extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TMessage extends ErrorMessage<ArrayIssue> | undefined,
>(item: TItem, message: TMessage): ArraySchemaAsync<TItem, TMessage>;

export function arrayAsync(
  item:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  message?: ErrorMessage<ArrayIssue>
): ArraySchemaAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  ErrorMessage<ArrayIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'array',
    reference: arrayAsync,
    expects: 'Array',
    async: true,
    item,
    message,
    async _run(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (Array.isArray(input)) {
        // Set typed to `true` and value to empty array
        dataset.typed = true;
        dataset.value = [];

        // Parse schema of each item async
        const itemDatasets = await Promise.all(
          input.map((value) => this.item._run({ typed: false, value }, config))
        );

        // Process each item dataset
        for (let key = 0; key < itemDatasets.length; key++) {
          // Get item dataset
          const itemDataset = itemDatasets[key];

          // If there are issues, capture them
          if (itemDataset.issues) {
            // Create array path item
            const pathItem: ArrayPathItem = {
              type: 'array',
              origin: 'value',
              input,
              key,
              value: input[key],
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

        // Otherwise, add array issue
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // Return output dataset
      return dataset as Dataset<unknown[], ArrayIssue | BaseIssue<unknown>>;
    },
  };
}
