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
import { _addIssue, _isAllowedObjectKey } from '../../utils/index.ts';
import type { LooseObjectIssue } from './types.ts';

/**
 * Object schema async type.
 */
export interface LooseObjectSchemaAsync<
  TEntries extends ObjectEntriesAsync,
  TMessage extends ErrorMessage<LooseObjectIssue> | undefined,
> extends BaseSchemaAsync<
    InferObjectInput<TEntries> & { [key: string]: unknown },
    InferObjectOutput<TEntries> & { [key: string]: unknown },
    LooseObjectIssue | InferObjectIssue<TEntries>
  > {
  /**
   * The schema type.
   */
  readonly type: 'loose_object';
  /**
   * The schema reference.
   */
  readonly reference: typeof looseObjectAsync;
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
 * Creates a loose object schema.
 *
 * @param entries The entries schema.
 *
 * @returns A loose object schema.
 */
export function looseObjectAsync<const TEntries extends ObjectEntriesAsync>(
  entries: TEntries
): LooseObjectSchemaAsync<TEntries, undefined>;

/**
 * Creates a loose object schema.
 *
 * @param entries The entries schema.
 * @param message The error message.
 *
 * @returns A loose object schema.
 */
export function looseObjectAsync<
  const TEntries extends ObjectEntriesAsync,
  const TMessage extends ErrorMessage<LooseObjectIssue> | undefined,
>(
  entries: TEntries,
  message: TMessage
): LooseObjectSchemaAsync<TEntries, TMessage>;

export function looseObjectAsync(
  entries: ObjectEntriesAsync,
  message?: ErrorMessage<LooseObjectIssue>
): LooseObjectSchemaAsync<
  ObjectEntriesAsync,
  ErrorMessage<LooseObjectIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'loose_object',
    reference: looseObjectAsync,
    expects: 'Object',
    async: true,
    entries,
    message,
    async _run(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (input && typeof input === 'object') {
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

        // Add rest to dataset if necessary
        if (!dataset.issues || !config.abortEarly) {
          for (const key in input) {
            // TODO: We should document that we exclude specific keys for
            // security reasons.
            if (_isAllowedObjectKey(key) && !(key in this.entries)) {
              // @ts-expect-error
              dataset.value[key] = input[key];
            }
          }
        }

        // Otherwise, add object issue
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // Return output dataset
      return dataset as Dataset<
        InferObjectOutput<ObjectEntriesAsync> & { [key: string]: unknown },
        LooseObjectIssue | InferObjectIssue<ObjectEntriesAsync>
      >;
    },
  };
}
