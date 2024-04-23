import type {
  BaseIssue,
  BaseSchema,
  Dataset,
  ErrorMessage,
  InferInput,
  InferIssue,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  InferOutput,
  ObjectEntries,
  ObjectPathItem,
} from '../../types/index.ts';
import { _addIssue, _isAllowedObjectKey } from '../../utils/index.ts';

/**
 * Object with rest issue type.
 */
export interface ObjectWithRestIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'object_with_rest';
  /**
   * The expected input.
   */
  readonly expected: 'Object';
}

/**
 * Object with rest schema type.
 */
export interface ObjectWithRestSchema<
  TEntries extends ObjectEntries,
  TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<ObjectWithRestIssue> | undefined,
> extends BaseSchema<
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
  readonly reference: typeof objectWithRest;
  /**
   * The expected property.
   */
  readonly expects: 'Object';
  /**
   * The object entries.
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
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param rest The rest schema.
 *
 * @returns An object schema.
 */
export function objectWithRest<
  const TEntries extends ObjectEntries,
  const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(
  entries: TEntries,
  rest: TRest
): ObjectWithRestSchema<TEntries, TRest, undefined>;

/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param rest The rest schema.
 * @param message The error message.
 *
 * @returns An object schema.
 */
export function objectWithRest<
  const TEntries extends ObjectEntries,
  const TRest extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  const TMessage extends ErrorMessage<ObjectWithRestIssue> | undefined,
>(
  entries: TEntries,
  rest: TRest,
  message: TMessage
): ObjectWithRestSchema<TEntries, TRest, TMessage>;

export function objectWithRest(
  entries: ObjectEntries,
  rest: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  message?: ErrorMessage<ObjectWithRestIssue>
): ObjectWithRestSchema<
  ObjectEntries,
  BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  ErrorMessage<ObjectWithRestIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'object_with_rest',
    reference: objectWithRest,
    expects: 'Object',
    async: false,
    entries,
    rest,
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

        // Parse schema of each rest entry if necessary
        if (!dataset.issues || !config.abortEarly) {
          for (const key in input) {
            // TODO: We should document that we exclude specific keys for
            // security reasons.
            if (_isAllowedObjectKey(key) && !(key in this.entries)) {
              const value: unknown = input[key as keyof typeof input];
              const valueDataset = this.rest._run(
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

              // Add entry to dataset
              // @ts-expect-error
              dataset.value[key] = valueDataset.value;
            }
          }
        }

        // Otherwise, add object issue
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // Return output dataset
      return dataset as Dataset<
        InferObjectOutput<ObjectEntries> & { [key: string]: unknown },
        | ObjectWithRestIssue
        | InferObjectIssue<ObjectEntries>
        | BaseIssue<unknown>
      >;
    },
  };
}
