import type {
  BaseIssue,
  BaseSchema,
  Dataset,
  ErrorMessage,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  ObjectEntries,
  ObjectPathItem,
} from '../../types/index.ts';
import { _addIssue, _isAllowedObjectKey } from '../../utils/index.ts';

/**
 * Strict object issue type.
 */
export interface LooseObjectIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'loose_object';
  /**
   * The expected input.
   */
  readonly expected: 'Object';
}

/**
 * Strict object schema type.
 */
export interface LooseObjectSchema<
  TEntries extends ObjectEntries,
  TMessage extends ErrorMessage<LooseObjectIssue> | undefined,
> extends BaseSchema<
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
  readonly reference: typeof looseObject;
  /**
   * The expected property.
   */
  readonly expects: 'Object';
  /**
   * The object entries.
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
 * @param entries The object entries.
 *
 * @returns A loose object schema.
 */
export function looseObject<const TEntries extends ObjectEntries>(
  entries: TEntries
): LooseObjectSchema<TEntries, undefined>;

/**
 * Creates a loose object schema.
 *
 * @param entries The object entries.
 * @param message The error message.
 *
 * @returns A loose object schema.
 */
export function looseObject<
  const TEntries extends ObjectEntries,
  const TMessage extends ErrorMessage<LooseObjectIssue> | undefined,
>(entries: TEntries, message: TMessage): LooseObjectSchema<TEntries, TMessage>;

export function looseObject(
  entries: ObjectEntries,
  message?: ErrorMessage<LooseObjectIssue>
): LooseObjectSchema<
  ObjectEntries,
  ErrorMessage<LooseObjectIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'loose_object',
    reference: looseObject,
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

        // Copy input object to dataset value
        for (const key in input) {
          // TODO: We should document that we exclude specific keys for
          // security reasons.
          if (_isAllowedObjectKey(key)) {
            // @ts-expect-error
            dataset.value[key] = input[key];
          }
        }

        // Parse schema of each entry
        for (const key in this.entries) {
          // TODO: We should document that missing keys do not cause issues
          // when `undefined` passes the schema. The reason for this decision
          // is that it reduces the bundle size, and we also expect that most
          // users will expect this behavior.

          // Get and parse value of key
          const value = input[key as keyof typeof input];
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
        InferObjectOutput<ObjectEntries> & { [key: string]: unknown },
        LooseObjectIssue | InferObjectIssue<ObjectEntries>
      >;
    },
  };
}
