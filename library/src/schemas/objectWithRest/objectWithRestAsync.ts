import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Dataset,
  ErrorMessage,
  InferInput,
  InferIssue,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  InferOutput,
  ObjectEntriesAsync,
  ObjectPathItem,
} from '../../types/index.ts';
import { _addIssue, _isValidObjectKey } from '../../utils/index.ts';
import type { ObjectWithRestIssue } from './types.ts';

/**
 * Object schema async type.
 */
export interface ObjectWithRestSchemaAsync<
  TEntries extends ObjectEntriesAsync,
  TRest extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<ObjectWithRestIssue> | undefined,
> extends BaseSchemaAsync<
    InferObjectInput<TEntries> & { [key: string]: InferInput<TRest> },
    InferObjectOutput<TEntries> & { [key: string]: InferOutput<TRest> },
    ObjectWithRestIssue | InferObjectIssue<TEntries> | InferIssue<TRest>
  > {
  /**
   * The schema type.
   */
  readonly type: 'object_with_rest';
  /**
   * The schema reference.
   */
  readonly reference: typeof objectWithRestAsync;
  /**
   * The expected property.
   */
  readonly expects: 'Object';
  /**
   * The entries schema.
   */
  readonly entries: TEntries;
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
 * Creates an object with rest schema.
 *
 * @param entries The entries schema.
 * @param rest The rest schema.
 *
 * @returns An object with rest schema.
 */
export function objectWithRestAsync<
  const TEntries extends ObjectEntriesAsync,
  const TRest extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(
  entries: TEntries,
  rest: TRest
): ObjectWithRestSchemaAsync<TEntries, TRest, undefined>;

/**
 * Creates an object with rest schema.
 *
 * @param entries The entries schema.
 * @param rest The rest schema.
 * @param message The error message.
 *
 * @returns An object with rest schema.
 */
export function objectWithRestAsync<
  const TEntries extends ObjectEntriesAsync,
  const TRest extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  const TMessage extends ErrorMessage<ObjectWithRestIssue> | undefined,
>(
  entries: TEntries,
  rest: TRest,
  message: TMessage
): ObjectWithRestSchemaAsync<TEntries, TRest, TMessage>;

export function objectWithRestAsync(
  entries: ObjectEntriesAsync,
  rest:
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  message?: ErrorMessage<ObjectWithRestIssue>
): ObjectWithRestSchemaAsync<
  ObjectEntriesAsync,
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  ErrorMessage<ObjectWithRestIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'object_with_rest',
    reference: objectWithRestAsync,
    expects: 'Object',
    async: true,
    entries,
    rest,
    message,
    async _run(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (input && typeof input === 'object') {
        // Set typed to `true` and value to blank object
        dataset.typed = true;
        dataset.value = {};

        // Parse each normal and rest entry
        const [normalDatasets, restDatasets] = await Promise.all([
          // Parse schema of each normal entry
          // Hint: We do not distinguish between missing and `undefined` entries.
          // The reason for this decision is that it reduces the bundle size, and
          // we also expect that most users will expect this behavior.
          Promise.all(
            Object.entries(this.entries).map(async ([key, schema]) => {
              const value = input[key as keyof typeof input];
              return [
                key,
                value,
                await schema._run({ typed: false, value }, config),
              ] as const;
            })
          ),

          // Parse other entries with rest schema
          // Hint: We exclude specific keys for security reasons
          Promise.all(
            Object.entries(input)
              .filter(
                ([key]) =>
                  _isValidObjectKey(input, key) && !(key in this.entries)
              )
              .map(
                async ([key, value]) =>
                  [
                    key,
                    value,
                    await this.rest._run({ typed: false, value }, config),
                  ] as const
              )
          ),
        ]);

        // Process each normal dataset
        for (const [key, value, valueDataset] of normalDatasets) {
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

        // Parse schema of each rest entry if necessary
        if (!dataset.issues || !config.abortEarly) {
          // Process each normal dataset
          for (const [key, value, valueDataset] of restDatasets) {
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

            // Add entry to dataset
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
        InferObjectOutput<ObjectEntriesAsync> & { [key: string]: unknown },
        | ObjectWithRestIssue
        | InferObjectIssue<ObjectEntriesAsync>
        | BaseIssue<unknown>
      >;
    },
  };
}
