import { getDefault } from '../../methods/index.ts';
import type {
  BaseSchema,
  ErrorMessage,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  ObjectEntries,
  ObjectPathItem,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue, _getStandardProps } from '../../utils/index.ts';
import type { ObjectIssue } from './types.ts';

/**
 * Object schema interface.
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
 * Hint: This schema removes unknown entries. The output will only include the
 * entries you specify. To include unknown entries, use `looseObject`. To
 * return an issue for unknown entries, use `strictObject`. To include and
 * validate unknown entries, use `objectWithRest`.
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
 * Hint: This schema removes unknown entries. The output will only include the
 * entries you specify. To include unknown entries, use `looseObject`. To
 * return an issue for unknown entries, use `strictObject`. To include and
 * validate unknown entries, use `objectWithRest`.
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

// @__NO_SIDE_EFFECTS__
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
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (input && typeof input === 'object') {
        // Set typed to `true` and value to blank object
        // @ts-expect-error
        dataset.typed = true;
        dataset.value = {};

        // Parse schema of each entry
        for (const key in this.entries) {
          // If key is not missing, parse value of key
          if (key in input) {
            const valueDataset = this.entries[key]['~run'](
              // @ts-expect-error
              { value: input[key] },
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
                // @ts-expect-error
                value: input[key],
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
            // @ts-expect-error
            dataset.value[key] = valueDataset.value;

            // Otherwise, if key is missing and optional, use default value
            // if available
          } else {
            if (this.entries[key].type === 'optional') {
              // @ts-expect-error
              if (this.entries[key].default !== undefined) {
                // @ts-expect-error
                dataset.value[key] = getDefault(this.entries[key]);
              }

              // Otherwise, if key is missing and required, add issue
            } else {
              _addIssue(this, 'key', dataset, config, {
                input: undefined,
                expected: `"${key}"`,
                path: [
                  {
                    type: 'object',
                    origin: 'key',
                    input: input as Record<string, unknown>,
                    key,
                    // @ts-expect-error
                    value: input[key],
                  },
                ],
              });
            }
          }
        }

        // Otherwise, add object issue
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // Return output dataset
      // @ts-expect-error
      return dataset as OutputDataset<
        InferObjectOutput<ObjectEntries>,
        ObjectIssue | InferObjectIssue<ObjectEntries>
      >;
    },
  };
}
