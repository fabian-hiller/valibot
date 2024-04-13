import type {
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
import type { ArrayIssue, ArrayPathItem } from './types.ts';

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
    expects: 'Array',
    item,
    message,
    async: true,
    async _run(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (Array.isArray(input)) {
        // Set typed to true and value to empty array
        dataset.typed = true;

        // Parse schema of each array item
        dataset.value = await Promise.all(
          input.map(async (value, key) => {
            const itemDataset = await this.item._run(
              { typed: false, value },
              config
            );

            // If not aborted early, continue execution
            if (!config.abortEarly || !dataset.issues) {
              // If there are issues, capture them
              if (itemDataset.issues) {
                // Create array path item
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
                  throw null;
                }
              }

              // If not typed, set typed to false
              if (!itemDataset.typed) {
                dataset.typed = false;
              }

              // Add item to dataset
              return itemDataset.value;
            }
          })
        ).catch(() => []);

        // Otherwise, add array issue
      } else {
        _addIssue(this, arrayAsync, 'type', dataset, config);
      }

      // Return output dataset
      return dataset as Dataset<
        InferOutput<
          | BaseSchema<unknown, unknown, BaseIssue<unknown>>
          | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
        >[],
        | ArrayIssue
        | InferIssue<
            | BaseSchema<unknown, unknown, BaseIssue<unknown>>
            | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
          >
      >;
    },
  };
}
