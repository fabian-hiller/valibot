import type {
  BaseSchema,
  ErrorMessage,
  Issues,
  Pipe,
} from '../../types/index.ts';
import {
  pipeResult,
  parseResult,
  restAndDefaultArgs,
  schemaIssue,
} from '../../utils/index.ts';
import type { ObjectOutput, ObjectInput, ObjectPathItem } from './types.ts';

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
  message: ErrorMessage;
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
  const [rest, message = 'Invalid type', pipe] = restAndDefaultArgs<
    TRest,
    Pipe<ObjectOutput<TEntries, TRest>>
  >(arg2, arg3, arg4);

  // Create cached entries
  let cachedEntries: [string, BaseSchema][];

  // Create and return object schema
  return {
    type: 'object',
    async: false,
    entries,
    rest,
    message,
    pipe,
    _parse(input, info) {
      // Check type of input
      if (!input || typeof input !== 'object') {
        return schemaIssue(info, 'type', 'object', this.message, input);
      }

      // Cache object entries lazy
      cachedEntries = cachedEntries || Object.entries(this.entries);

      // Create typed, issues and output
      let typed = true;
      let issues: Issues | undefined;
      const output: Record<string, any> = {};

      // Parse schema of each key
      for (const [key, schema] of cachedEntries) {
        const value = (input as Record<string, unknown>)[key];
        const result = schema._parse(value, info);

        // If there are issues, capture them
        if (result.issues) {
          // Create object path item
          const pathItem: ObjectPathItem = {
            type: 'object',
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
          if (info?.abortEarly) {
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
      if (this.rest && !(info?.abortEarly && issues)) {
        for (const key in input) {
          if (!(key in this.entries)) {
            const value = (input as Record<string, unknown>)[key];
            const result = this.rest._parse(value, info);

            // If there are issues, capture them
            if (result.issues) {
              // Create object path item
              const pathItem: ObjectPathItem = {
                type: 'object',
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
              if (info?.abortEarly) {
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

      // If output is typed, execute pipe
      if (typed) {
        return pipeResult(
          output as ObjectOutput<TEntries, TRest>,
          this.pipe,
          info,
          'object',
          issues
        );
      }

      // Otherwise, return untyped parse result
      return parseResult(false, output, issues as Issues);
    },
  };
}
