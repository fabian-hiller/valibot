import type {
  BaseSchemaAsync,
  Dataset,
  ErrorMessage,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  ObjectEntriesAsync,
  ObjectPathItem,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { ObjectIssue } from './types.ts';

/**
 * Object schema async type.
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
   * The entries schema.
   */
  readonly entries: TEntries;
  /**
   * The expected property.
   */
  readonly expects: 'Object';
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
    async _run(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (input && typeof input === 'object' && input.constructor === Object) {
        // Set typed to `true` and value to blank object
        dataset.typed = true;
        dataset.value = {};

        // Parse schema of each entry
        const valueDatasets = await Promise.all(
          Object.entries(this.entries).map(async ([key, schema]) => {
            // TODO: We should document that missing keys do not cause issues
            // when `undefined` passes the schema. The reason for this decision
            // is that it reduces the bundle size, and we also expect that most
            // users will expect this behavior.
            const value = input[key as keyof typeof input];
            return [
              key,
              value,
              await schema._run({ typed: false, value }, config),
            ] as const;
          })
        );

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
      return dataset as Dataset<
        InferObjectOutput<ObjectEntriesAsync>,
        ObjectIssue | InferObjectIssue<ObjectEntriesAsync>
      >;
    },
  };
}
