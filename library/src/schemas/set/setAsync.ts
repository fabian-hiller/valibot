import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Dataset,
  ErrorMessage,
  InferIssue,
  SetPathItem,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { InferSetInput, InferSetOutput, SetIssue } from './types.ts';

/**
 * Set schema async type.
 */
export interface SetSchemaAsync<
  TValue extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<SetIssue> | undefined,
> extends BaseSchemaAsync<
    InferSetInput<TValue>,
    InferSetOutput<TValue>,
    SetIssue | InferIssue<TValue>
  > {
  /**
   * The schema type.
   */
  readonly type: 'set';
  /**
   * The schema reference.
   */
  readonly reference: typeof setAsync;
  /**
   * The expected property.
   */
  readonly expects: 'Set';
  /**
   * The set value schema.
   */
  readonly value: TValue;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a set schema.
 *
 * @param value The value schema.
 *
 * @returns A set schema.
 */
export function setAsync<
  const TValue extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(value: TValue): SetSchemaAsync<TValue, undefined>;

/**
 * Creates a set schema.
 *
 * @param value The value schema.
 * @param message The error message.
 *
 * @returns A set schema.
 */
export function setAsync<
  const TValue extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TMessage extends ErrorMessage<SetIssue> | undefined,
>(value: TValue, message: TMessage): SetSchemaAsync<TValue, TMessage>;

export function setAsync(
  value:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  message?: ErrorMessage<SetIssue>
): SetSchemaAsync<
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  ErrorMessage<SetIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'set',
    reference: setAsync,
    expects: 'Set',
    async: true,
    value,
    message,
    async _run(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (input instanceof Set) {
        // Set typed to `true` and value to empty set
        dataset.typed = true;
        dataset.value = new Set();

        // Parse schema of each set value
        const valueDatasets = await Promise.all(
          [...input].map(
            async (inputValue) =>
              [
                inputValue,
                await this.value._run(
                  { typed: false, value: inputValue },
                  config
                ),
              ] as const
          )
        );

        // Process dataset of each set value
        for (const [inputValue, valueDataset] of valueDatasets) {
          // If there are issues, capture them
          if (valueDataset.issues) {
            // Create set path item
            const pathItem: SetPathItem = {
              type: 'set',
              origin: 'value',
              input,
              value: inputValue,
            };

            // Add modified item dataset issues to issues
            for (const issue of valueDataset.issues) {
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
              dataset.issues = valueDataset.issues;
            }

            // If necessary, abort early
            if (config.abortEarly) {
              dataset.typed = false;
              break;
            }
          }

          // If not typed, set typed to `false`
          if (!valueDataset.typed) {
            dataset.typed = false;
          }

          // Add value to dataset
          // @ts-expect-error
          dataset.value.add(valueDataset.value);
        }

        // Otherwise, add set issue
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // Return output dataset
      return dataset as Dataset<Set<unknown>, SetIssue | BaseIssue<unknown>>;
    },
  };
}
