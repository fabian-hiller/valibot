import type {
  BaseSchema,
  ErrorMessage,
  Pipe,
  SchemaIssues,
} from '../../types/index.ts';
import {
  pipeResult,
  restAndDefaultArgs,
  schemaIssue,
  schemaResult,
} from '../../utils/index.ts';
import type { ObjectInput, ObjectOutput, ObjectPathItem } from './types.ts';

/**
 * Object entries type.
 */
export type ObjectEntries = Record<string, BaseSchema>;

/**
 * Object schema type.
 */
export interface ObjectSchema<
  TEntries extends ObjectEntries,
  TRest extends BaseSchema | undefined = undefined,
  TOutput = ObjectOutput<TEntries, TRest>
> extends BaseSchema<ObjectInput<TEntries, TRest>, TOutput> {
  /**
   * The schema type.
   */
  type: 'object';
  /**
   * The object entries schema.
   */
  entries: TEntries;
  /**
   * The object rest schema.
   */
  rest: TRest;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<ObjectOutput<TEntries, TRest>> | undefined;
}

/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function object<TEntries extends ObjectEntries>(
  entries: TEntries,
  pipe?: Pipe<ObjectOutput<TEntries, undefined>>
): ObjectSchema<TEntries>;

/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function object<TEntries extends ObjectEntries>(
  entries: TEntries,
  message?: ErrorMessage,
  pipe?: Pipe<ObjectOutput<TEntries, undefined>>
): ObjectSchema<TEntries>;

/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function object<
  TEntries extends ObjectEntries,
  TRest extends BaseSchema | undefined
>(
  entries: TEntries,
  rest: TRest,
  pipe?: Pipe<ObjectOutput<TEntries, TRest>>
): ObjectSchema<TEntries, TRest>;

/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param rest The object rest.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function object<
  TEntries extends ObjectEntries,
  TRest extends BaseSchema | undefined
>(
  entries: TEntries,
  rest: TRest,
  message?: ErrorMessage,
  pipe?: Pipe<ObjectOutput<TEntries, TRest>>
): ObjectSchema<TEntries, TRest>;

export function object<
  TEntries extends ObjectEntries,
  TRest extends BaseSchema | undefined = undefined
>(
  entries: TEntries,
  arg2?: Pipe<ObjectOutput<TEntries, TRest>> | ErrorMessage | TRest,
  arg3?: Pipe<ObjectOutput<TEntries, TRest>> | ErrorMessage,
  arg4?: Pipe<ObjectOutput<TEntries, TRest>>
): ObjectSchema<TEntries, TRest> {
  // Get rest, message and pipe argument
  const [rest, message, pipe] = restAndDefaultArgs<
    TRest,
    Pipe<ObjectOutput<TEntries, TRest>>
  >(arg2, arg3, arg4);

  // Create cached entries
  let cachedEntries: [string, BaseSchema][];

  // Create and return object schema
  return {
    type: 'object',
    expects: 'Object',
    async: false,
    entries,
    rest,
    message,
    pipe,
    _parse(input, config) {
      // If root type is valid, check nested types
      if (input && typeof input === 'object') {
        // Cache object entries lazy
        cachedEntries = cachedEntries ?? Object.entries(this.entries);

        // Create typed, issues and output
        let typed = true;
        let issues: SchemaIssues | undefined;
        const output: Record<string, any> = {};

        // Parse schema of each key
        for (const [key, schema] of cachedEntries) {
          const value = (input as Record<string, unknown>)[key];
          const result = schema._parse(value, config);

          // If there are issues, capture them
          if (result.issues) {
            // Create object path item
            const pathItem: ObjectPathItem = {
              type: 'object',
              origin: 'value',
              input: input as Record<string, unknown>,
              key,
              value,
            };

            // Add modified result issues to issues
            for (const issue of result.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                issue.path = [pathItem];
              }
              issues?.push(issue);
            }
            if (!issues) {
              issues = result.issues;
            }

            // If necessary, abort early
            if (config?.abortEarly) {
              typed = false;
              break;
            }
          }

          // If not typed, set typed to false
          if (!result.typed) {
            typed = false;
          }

          // Set output of entry if necessary
          if (result.output !== undefined || key in input) {
            output[key] = result.output;
          }
        }

        // If necessary parse schema of each rest entry
        if (this.rest && !(config?.abortEarly && issues)) {
          for (const key in input) {
            if (!(key in this.entries)) {
              const value = (input as Record<string, unknown>)[key];
              const result = this.rest._parse(value, config);

              // If there are issues, capture them
              if (result.issues) {
                // Create object path item
                const pathItem: ObjectPathItem = {
                  type: 'object',
                  origin: 'value',
                  input: input as Record<string, unknown>,
                  key,
                  value,
                };

                // Add modified result issues to issues
                for (const issue of result.issues) {
                  if (issue.path) {
                    issue.path.unshift(pathItem);
                  } else {
                    issue.path = [pathItem];
                  }
                  issues?.push(issue);
                }
                if (!issues) {
                  issues = result.issues;
                }

                // If necessary, abort early
                if (config?.abortEarly) {
                  typed = false;
                  break;
                }
              }

              // If not typed, set typed to false
              if (!result.typed) {
                typed = false;
              }

              // Set output of entry
              output[key] = result.output;
            }
          }
        }

        // If output is typed, return pipe result
        if (typed) {
          return pipeResult(
            this,
            output as ObjectOutput<TEntries, TRest>,
            config,
            issues
          );
        }

        // Otherwise, return untyped schema result
        return schemaResult(false, output, issues as SchemaIssues);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, object, input, config);
    },
  };
}
