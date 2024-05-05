import type {
  BaseSchema,
  Dataset,
  ErrorMessage,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  ObjectEntries,
  ObjectPathItem,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { ObjectIssue } from './types.ts';

/**
 * Object schema type.
 */
export interface ObjectSchema<
  TEntries extends ObjectEntries,
  TMessage extends ErrorMessage<ObjectIssue> | undefined,
> extends BaseSchema<
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
  readonly reference: typeof object;
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
 * Hint: This schema ignores and excludes unknown entries. The output will
 * include only the entries you specify. To include unknown entries, use the
 * `looseObject` schema. To return an issue for unknown entries, use the
 * `strictObject` schema. To include and validate unknown entries, use the
 * `objectWithRest` schema.
 *
 * @param entries The entries schema.
 *
 * @returns An object schema.
 */
export function object<const TEntries extends ObjectEntries>(
  entries: TEntries
): ObjectSchema<TEntries, undefined>;

/**
 * Creates an object schema.
 *
 * Hint: This schema ignores and excludes unknown entries. The output will
 * include only the entries you specify. To include unknown entries, use the
 * `looseObject` schema. To return an issue for unknown entries, use the
 * `strictObject` schema. To include and validate unknown entries, use the
 * `objectWithRest` schema.
 *
 * @param entries The entries schema.
 * @param message The error message.
 *
 * @returns An object schema.
 */
export function object<
  const TEntries extends ObjectEntries,
  const TMessage extends ErrorMessage<ObjectIssue> | undefined,
>(entries: TEntries, message: TMessage): ObjectSchema<TEntries, TMessage>;

export function object(
  entries: ObjectEntries,
  message?: ErrorMessage<ObjectIssue>
): ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'object',
    reference: object,
    expects: 'Object',
    async: false,
    entries,
    message,
    _run(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (input && typeof input === 'object' && input.constructor === Object) {
        // Set typed to true and value to blank object
        dataset.typed = true;
        dataset.value = {};

        // Parse schema of each entry
        for (const key in this.entries) {
          // TODO: We should document that missing keys do not cause issues
          // when `undefined` passes the schema. The reason for this decision
          // is that it reduces the bundle size, and we also expect that most
          // users will expect this behavior.

          // Get and parse value of key
          const value: unknown = input[key as keyof typeof input];
          const valueDataset = this.entries[key]._run(
            { typed: false, value },
            config
          );

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

          // If not typed, set typed to false
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
        InferObjectOutput<ObjectEntries>,
        ObjectIssue | InferObjectIssue<ObjectEntries>
      >;
    },
  };
}
