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
import type { StrictObjectIssue } from './types.ts';

/**
 * Strict object schema type.
 */
export interface StrictObjectSchema<
  TEntries extends ObjectEntries,
  TMessage extends ErrorMessage<StrictObjectIssue> | undefined,
> extends BaseSchema<
    InferObjectInput<TEntries>,
    InferObjectOutput<TEntries>,
    StrictObjectIssue | InferObjectIssue<TEntries>
  > {
  /**
   * The schema type.
   */
  readonly type: 'strict_object';
  /**
   * The schema reference.
   */
  readonly reference: typeof strictObject;
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
 * Creates a strict object schema.
 *
 * @param entries The entries schema.
 *
 * @returns A strict object schema.
 */
export function strictObject<const TEntries extends ObjectEntries>(
  entries: TEntries
): StrictObjectSchema<TEntries, undefined>;

/**
 * Creates a strict object schema.
 *
 * @param entries The entries schema.
 * @param message The error message.
 *
 * @returns A strict object schema.
 */
export function strictObject<
  const TEntries extends ObjectEntries,
  const TMessage extends ErrorMessage<StrictObjectIssue> | undefined,
>(entries: TEntries, message: TMessage): StrictObjectSchema<TEntries, TMessage>;

// @__NO_SIDE_EFFECTS__
export function strictObject(
  entries: ObjectEntries,
  message?: ErrorMessage<StrictObjectIssue>
): StrictObjectSchema<
  ObjectEntries,
  ErrorMessage<StrictObjectIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'strict_object',
    reference: strictObject,
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
        // Hint: We do not distinguish between missing and `undefined` entries.
        // The reason for this decision is that it reduces the bundle size, and
        // we also expect that most users will expect this behavior.
        for (const key in this.entries) {
          // Get and parse value of key
          const value = input[key as keyof typeof input];
          const valueDataset = this.entries[key]['~run']({ value }, config);

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

        // Check input for unknown keys if necessary
        if (!dataset.issues || !config.abortEarly) {
          for (const key in input) {
            if (!(key in this.entries)) {
              const value: unknown = input[key as keyof typeof input];
              _addIssue(this, 'type', dataset, config, {
                input: value,
                expected: 'never',
                path: [
                  {
                    type: 'object',
                    origin: 'value',
                    input: input as Record<string, unknown>,
                    key,
                    value,
                  },
                ],
              });

              // Hint: We intentionally break the loop after the first unknown
              // entries. Otherwise, attackers could send large objects to
              // exhaust device resources. If you want an issue for every
              // unknown key, use the `objectWithRest` schema with `never` for
              // the `rest` argument.
              break;
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
        StrictObjectIssue | InferObjectIssue<ObjectEntries>
      >;
    },
  };
}
