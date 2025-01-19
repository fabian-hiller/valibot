import type {
  BaseIssue,
  BaseSchemaAsync,
  ErrorMessage,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  ObjectEntriesAsync,
  ObjectPathItem,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue, _getStandardProps } from '../../utils/index.ts';
import type { ObjectIssue } from './types.ts';

/**
 * Object schema async interface.
 */
export interface ObjectSchemaAsync<
  TEntries extends ObjectEntriesAsync,
  TMessage extends ErrorMessage<ObjectIssue> | undefined,
> extends BaseSchemaAsync<
    InferObjectInput<TEntries>,
    InferObjectOutput<TEntries>,
    ObjectIssue | InferObjectIssue<TEntries>
  > {
  /**
   * The schema type.
   */
  readonly type: 'object';
  /**
   * The schema reference.
   */
  readonly reference: typeof objectAsync;
  /**
   * The expected property.
   */
  readonly expects: 'Object';
  /**
   * The entries schema.
   */
  readonly entries: TEntries;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an object schema.
 *
 * Hint: This schema removes unknown entries. The output will only include the
 * entries you specify. To include unknown entries, use `looseObjectAsync`. To
 * return an issue for unknown entries, use `strictObjectAsync`. To include and
 * validate unknown entries, use `objectWithRestAsync`.
 *
 * @param entries The entries schema.
 *
 * @returns An object schema.
 */
export function objectAsync<const TEntries extends ObjectEntriesAsync>(
  entries: TEntries
): ObjectSchemaAsync<TEntries, undefined>;

/**
 * Creates an object schema.
 *
 * Hint: This schema removes unknown entries. The output will only include the
 * entries you specify. To include unknown entries, use `looseObjectAsync`. To
 * return an issue for unknown entries, use `strictObjectAsync`. To include and
 * validate unknown entries, use `objectWithRestAsync`.
 *
 * @param entries The entries schema.
 * @param message The error message.
 *
 * @returns An object schema.
 */
export function objectAsync<
  const TEntries extends ObjectEntriesAsync,
  const TMessage extends ErrorMessage<ObjectIssue> | undefined,
>(entries: TEntries, message: TMessage): ObjectSchemaAsync<TEntries, TMessage>;

// @__NO_SIDE_EFFECTS__
export function objectAsync(
  entries: ObjectEntriesAsync,
  message?: ErrorMessage<ObjectIssue>
): ObjectSchemaAsync<
  ObjectEntriesAsync,
  ErrorMessage<ObjectIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'object',
    reference: objectAsync,
    expects: 'Object',
    async: true,
    entries,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    async '~run'(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (input && typeof input === 'object') {
        // Set typed to `true` and value to blank object
        // @ts-expect-error
        dataset.typed = true;
        dataset.value = {};

        // Parse schema of each entry
        // Hint: We do not distinguish between missing and `undefined` entries.
        // The reason for this decision is that it reduces the bundle size, and
        // we also expect that most users will expect this behavior.

        // Type of value dataset
        type ValueDataset = [
          /* key */ string,
          /* value */ unknown,
          /* result */ OutputDataset<unknown, BaseIssue<unknown>>,
        ];

        const isPromise = (value: unknown): value is PromiseLike<unknown> =>
          typeof value === 'object' && value !== null && 'then' in value;

        // Flag to abort early synchronously
        let shouldAbortEarly = false;

        // Array of value datasets
        const valueDatasets: ValueDataset[] = [];

        // Array of value datasets promises
        const valueDatasetsAsync: Array<Promise<ValueDataset>> = [];

        // Add each value dataset promise to array, but do not await them yet
        for (const [key, schema] of Object.entries(this.entries)) {
          const value = input[key as keyof typeof input];
          const result = schema['~run']({ value }, config);

          // If validation result is a promise - add promise to array, to await later
          if (isPromise(result)) {
            valueDatasetsAsync.push(
              result.then((resolved) => [key, value, resolved])
            );
          }

          // If got validation result synchronously - add it to result array right away
          else {
            // Add sync dataset to result array
            valueDatasets.push([key, value, result]);

            // If there are issues, abort early
            if (config.abortEarly && result.issues) {
              shouldAbortEarly = true;
              break;
            }
          }
        }

        // Await for async datasets
        if (valueDatasetsAsync.length > 0 && !shouldAbortEarly) {
          await new Promise<void>((resolve) => {
            let awaited = 0;
            for (const promise of valueDatasetsAsync) {
              promise.then((dataset) => {
                if (awaited > -1) {
                  valueDatasets.push(dataset);
                  if (
                    ++awaited === valueDatasetsAsync.length ||
                    (dataset[2].issues && config.abortEarly)
                  ) {
                    awaited = -1;
                    resolve();
                  }
                }
              });
            }
          });
        }

        // Process each value dataset
        for (const [key, value, valueDataset] of valueDatasets) {
          // If there are issues, capture them
          if (valueDataset.issues) {
            // Create object path item
            const pathItem: ObjectPathItem = {
              type: 'object',
              origin: 'value',
              input: input as Record<string, unknown>,
              key,
              value,
            };

            // Add modified entry dataset issues to issues
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

          // Add entry to dataset if necessary
          if (valueDataset.value !== undefined || key in input) {
            // @ts-expect-error
            dataset.value[key] = valueDataset.value;
          }
        }

        // Otherwise, add object issue
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // Return output dataset
      // @ts-expect-error
      return dataset as OutputDataset<
        InferObjectOutput<ObjectEntriesAsync>,
        ObjectIssue | InferObjectIssue<ObjectEntriesAsync>
      >;
    },
  };
}
