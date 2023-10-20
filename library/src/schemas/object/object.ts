import type { BaseSchema, ErrorMessage, Issues, Pipe } from '../../types.ts';
import {
  executePipe,
  getIssues,
  getRestAndDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { ObjectOutput, ObjectInput, ObjectPathItem } from './types.ts';

/**
 * Object shape type.
 */
export type ObjectEntries = Record<string, BaseSchema<any>>;

/**
 * Object schema type.
 */
export type ObjectSchema<
  TObjectEntries extends ObjectEntries,
  TObjectRest extends BaseSchema | undefined = undefined,
  TOutput = ObjectOutput<TObjectEntries, TObjectRest>
> = BaseSchema<ObjectInput<TObjectEntries, TObjectRest>, TOutput> & {
  kind: 'object';
  /**
   * The object entries and rest schema.
   */
  object: { entries: TObjectEntries; rest: TObjectRest };
  /**
   * Validation and transformation pipe.
   */
  pipe: Pipe<ObjectOutput<TObjectEntries, TObjectRest>>;
};

/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function object<TObjectEntries extends ObjectEntries>(
  entries: TObjectEntries,
  pipe?: Pipe<ObjectOutput<TObjectEntries, undefined>>
): ObjectSchema<TObjectEntries>;

/**
 * Creates an object schema.
 *
 * @param entries The object entries.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function object<TObjectEntries extends ObjectEntries>(
  entries: TObjectEntries,
  error?: ErrorMessage,
  pipe?: Pipe<ObjectOutput<TObjectEntries, undefined>>
): ObjectSchema<TObjectEntries>;

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
  TObjectEntries extends ObjectEntries,
  TObjectRest extends BaseSchema | undefined
>(
  entries: TObjectEntries,
  rest: TObjectRest,
  pipe?: Pipe<ObjectOutput<TObjectEntries, TObjectRest>>
): ObjectSchema<TObjectEntries, TObjectRest>;

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
  TObjectEntries extends ObjectEntries,
  TObjectRest extends BaseSchema | undefined
>(
  entries: TObjectEntries,
  rest: TObjectRest,
  error?: ErrorMessage,
  pipe?: Pipe<ObjectOutput<TObjectEntries, TObjectRest>>
): ObjectSchema<TObjectEntries, TObjectRest>;

export function object<
  TObjectEntries extends ObjectEntries,
  TObjectRest extends BaseSchema | undefined = undefined
>(
  entries: TObjectEntries,
  arg2?:
    | Pipe<ObjectOutput<TObjectEntries, TObjectRest>>
    | ErrorMessage
    | TObjectRest,
  arg3?: Pipe<ObjectOutput<TObjectEntries, TObjectRest>> | ErrorMessage,
  arg4?: Pipe<ObjectOutput<TObjectEntries, TObjectRest>>
): ObjectSchema<TObjectEntries, TObjectRest> {
  // Get rest, error and pipe argument
  const [rest, error, pipe = []] = getRestAndDefaultArgs<
    TObjectRest,
    Pipe<ObjectOutput<TObjectEntries, TObjectRest>>
  >(arg2, arg3, arg4);

  // Create cached entries
  let cachedEntries: [string, BaseSchema<any>][];

  // Create and return object schema
  return {
    kind: 'object',
    async: false,
    object: { entries, rest },
    pipe,
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
            schema: 'object',
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
                schema: 'object',
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
            output as ObjectOutput<TObjectEntries, TObjectRest>,
            pipe,
            info,
            'object'
          );
    },
  };
}
