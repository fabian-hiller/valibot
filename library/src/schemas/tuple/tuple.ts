import type { BaseSchema, Issues, Pipe } from '../../types.ts';
import { executePipe, getIssues } from '../../utils/index.ts';
import type { TupleOutput, TupleInput, TuplePathItem } from './types.ts';
import { getTupleArgs } from './utils/index.ts';

/**
 * Tuple shape type.
 */
export type TupleShape = [BaseSchema, ...BaseSchema[]];

/**
 * Tuple schema type.
 */
export type TupleSchema<
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema | undefined = undefined,
  TOutput = TupleOutput<TTupleItems, TTupleRest>
> = BaseSchema<TupleInput<TTupleItems, TTupleRest>, TOutput> & {
  schema: 'tuple';
  tuple: { items: TTupleItems; rest: TTupleRest };
};

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<TTupleItems extends TupleShape>(
  items: TTupleItems,
  pipe?: Pipe<TupleOutput<TTupleItems, undefined>>
): TupleSchema<TTupleItems>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<TTupleItems extends TupleShape>(
  items: TTupleItems,
  error?: string,
  pipe?: Pipe<TupleOutput<TTupleItems, undefined>>
): TupleSchema<TTupleItems>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema
>(
  items: TTupleItems,
  rest: TTupleRest,
  pipe?: Pipe<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchema<TTupleItems, TTupleRest>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema
>(
  items: TTupleItems,
  rest: TTupleRest,
  error?: string,
  pipe?: Pipe<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchema<TTupleItems, TTupleRest>;

export function tuple<
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema
>(
  items: TTupleItems,
  arg2?: Pipe<TupleOutput<TTupleItems, TTupleRest>> | string | TTupleRest,
  arg3?: Pipe<TupleOutput<TTupleItems, TTupleRest>> | string,
  arg4?: Pipe<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchema<TTupleItems, TTupleRest> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getTupleArgs<
    TTupleRest,
    Pipe<TupleOutput<TTupleItems, TTupleRest>>
  >(arg2, arg3, arg4);

  // Create and return tuple schema
  return {
    /**
     * The schema type.
     */
    schema: 'tuple',

    /**
     * The tuple items and rest schema.
     */
    tuple: { items, rest },

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
      if (
        !Array.isArray(input) ||
        (!rest && items.length !== input.length) ||
        (rest && items.length > input.length)
      ) {
        return getIssues(info, 'type', 'tuple', error || 'Invalid type', input);
      }

      // Create issues and output
      let issues: Issues | undefined;
      const output: any[] = [];

      // Parse schema of each tuple item
      for (let key = 0; key < items.length; key++) {
        const value = input[key];
        const result = items[key]._parse(value, info);

        // If there are issues, capture them
        if (result.issues) {
          // Create tuple path item
          const pathItem: TuplePathItem = {
            schema: 'tuple',
            input: input as [any, ...any[]],
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

          // Otherwise, add item to tuple
        } else {
          output[key] = result.output;
        }
      }

      // If necessary parse schema of each rest item
      if (rest) {
        for (let key = items.length; key < input.length; key++) {
          const value = input[key];
          const result = rest._parse(value, info);

          // If there are issues, capture them
          if (result.issues) {
            // Create tuple path item
            const pathItem: TuplePathItem = {
              schema: 'tuple',
              input: input as [any, ...any[]],
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

            // Otherwise, add item to tuple
          } else {
            output[key] = result.output;
          }
        }
      }

      // Return issues or pipe result
      return issues
        ? { issues }
        : executePipe(
            output as TupleOutput<TTupleItems, TTupleRest>,
            pipe,
            info,
            'tuple'
          );
    },
  };
}
