import type { BaseSchema, ErrorMessage, Issues, Pipe } from '../../types.ts';
import {
  executePipe,
  getIssues,
  getRestAndDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { ObjectOutput, ObjectInput, ObjectPathItem } from './types.ts';

/**
 * Object entries type.
 */
export type ObjectEntries = Record<string, BaseSchema>;

/**
 * Object schema type.
 */
export type ObjectSchema<
  TEntries extends ObjectEntries,
  TRest extends BaseSchema | undefined = undefined,
  TOutput = ObjectOutput<TEntries, TRest>
> = BaseSchema<ObjectInput<TEntries, TRest>, TOutput> & {
  type: 'object';
  entries: TEntries;
  rest: TRest;
};

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
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function object<TEntries extends ObjectEntries>(
  entries: TEntries,
  error?: ErrorMessage,
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
 * @param error The error message.
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
  error?: ErrorMessage,
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
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getRestAndDefaultArgs<
    TRest,
    Pipe<ObjectOutput<TEntries, TRest>>
  >(arg2, arg3, arg4);

  // Create cached entries
  let cachedEntries: [string, BaseSchema][];

  // Create and return object schema
  return {
    /**
     * The schema type.
     */
    type: 'object',

    /**
     * The entries schema.
     */
    entries,

    /**
     * The rest schema.
     */
    rest,

    /**
     * Whether it's async.
     */
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      // Check type of input
      if (!input || typeof input !== 'object') {
        return getSchemaIssues(
          info,
          'type',
          'object',
          error || 'Invalid type',
          input
        );
      }

      // Cache object entries lazy
      cachedEntries = cachedEntries || Object.entries(entries);

      // Create issues and output
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
            input,
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
            break;
          }

          // Otherwise, add value to object
        } else if (result.output !== undefined || key in input) {
          output[key] = result.output;
        }
      }

      // If necessary parse schema of each rest entry
      if (rest && !(info?.abortEarly && issues)) {
        for (const key in input) {
          if (!(key in entries)) {
            const value = (input as Record<string, unknown>)[key];
            const result = rest._parse(value, info);

            // If there are issues, capture them
            if (result.issues) {
              // Create object path item
              const pathItem: ObjectPathItem = {
                type: 'object',
                input,
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
                break;
              }

              // Otherwise, add value to object
            } else {
              output[key] = result.output;
            }
          }
        }
      }

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipe(
            output as ObjectOutput<TEntries, TRest>,
            pipe,
            info,
            'object'
          );
    },
  };
}
