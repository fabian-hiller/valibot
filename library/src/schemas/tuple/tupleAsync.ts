import type { Issues } from '../../error/index.ts';
import type { BaseSchema, BaseSchemaAsync, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getErrorAndPipe,
  getIssue,
  getPath,
  getPathInfo,
  getPipeInfo,
} from '../../utils/index.ts';
import type { TupleInput, TupleOutput } from './types.ts';

/**
 * Tuple shape async type.
 */
export type TupleShapeAsync = [
  BaseSchema | BaseSchemaAsync,
  ...(BaseSchema[] | BaseSchemaAsync[])
];

/**
 * Tuple schema async type.
 */
export type TupleSchemaAsync<
  TTupleItems extends TupleShapeAsync,
  TTupleRest extends BaseSchema | BaseSchemaAsync | undefined = undefined,
  TOutput = TupleOutput<TTupleItems, TTupleRest>
> = BaseSchemaAsync<TupleInput<TTupleItems, TTupleRest>, TOutput> & {
  schema: 'tuple';
  tuple: { items: TTupleItems; rest: TTupleRest };
};

/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
export function tupleAsync<
  TTupleItems extends TupleShapeAsync,
  TTupleRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  items: TTupleItems,
  pipe?: PipeAsync<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchemaAsync<TTupleItems, TTupleRest>;

/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
export function tupleAsync<
  TTupleItems extends TupleShapeAsync,
  TTupleRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  items: TTupleItems,
  error?: string,
  pipe?: PipeAsync<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchemaAsync<TTupleItems, TTupleRest>;

/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
export function tupleAsync<
  TTupleItems extends TupleShapeAsync,
  TTupleRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  items: TTupleItems,
  rest: TTupleRest,
  pipe?: PipeAsync<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchemaAsync<TTupleItems, TTupleRest>;

/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
export function tupleAsync<
  TTupleItems extends TupleShapeAsync,
  TTupleRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  items: TTupleItems,
  rest: TTupleRest,
  error?: string,
  pipe?: PipeAsync<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchemaAsync<TTupleItems, TTupleRest>;

export function tupleAsync<
  TTupleItems extends TupleShapeAsync,
  TTupleRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  items: TTupleItems,
  arg2?: PipeAsync<TupleOutput<TTupleItems, TTupleRest>> | string | TTupleRest,
  arg3?: PipeAsync<TupleOutput<TTupleItems, TTupleRest>> | string,
  arg4?: PipeAsync<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchemaAsync<TTupleItems, TTupleRest> {
  // Get rest, error and pipe argument
  const { rest, error, pipe } = (
    typeof arg2 === 'object' && !Array.isArray(arg2)
      ? { rest: arg2, ...getErrorAndPipe(arg3, arg4) }
      : getErrorAndPipe(arg2, arg3 as any)
  ) as {
    rest: TTupleRest;
    error: string | undefined;
    pipe: PipeAsync<TupleOutput<TTupleItems, TTupleRest>>;
  };

  // Create and return async tuple schema
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
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      // Check type of input
      if (
        !Array.isArray(input) ||
        (!rest && items.length !== input.length) ||
        (rest && items.length > input.length)
      ) {
        return {
          issues: [
            getIssue(info, {
              reason: 'type',
              validation: 'tuple',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Create issues and output
      let issues: Issues | undefined;
      const output: any[] = [];

      await Promise.all([
        // Parse schema of each tuple item
        Promise.all(
          items.map(async (schema, index) => {
            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
              const value = input[index];
              const result = await schema._parse(
                value,
                getPathInfo(
                  info,
                  getPath(info?.path, {
                    schema: 'tuple',
                    input: input as [any, ...any[]],
                    key: index,
                    value,
                  })
                )
              );

              // If not aborted early, continue execution
              if (!(info?.abortEarly && issues)) {
                // If there are issues, capture them
                if (result.issues) {
                  if (issues) {
                    issues.push(...result.issues);
                  } else {
                    issues = result.issues;
                  }

                  // If necessary, abort early
                  if (info?.abortEarly) {
                    throw null;
                  }

                  // Otherwise, add item to tuple
                } else {
                  output[index] = result.output;
                }
              }
            }
          })
        ),

        // If necessary parse schema of each rest item
        rest &&
          Promise.all(
            input.slice(items.length).map(async (value, index) => {
              // If not aborted early, continue execution
              if (!(info?.abortEarly && issues)) {
                const tupleIndex = items.length + index;
                const result = await rest._parse(
                  value,
                  getPathInfo(
                    info,
                    getPath(info?.path, {
                      schema: 'tuple',
                      input: input as [any, ...any[]],
                      key: tupleIndex,
                      value,
                    })
                  )
                );

                // If not aborted early, continue execution
                if (!(info?.abortEarly && issues)) {
                  // If there are issues, capture them
                  if (result.issues) {
                    if (issues) {
                      issues.push(...result.issues);
                    } else {
                      issues = result.issues;
                    }

                    // If necessary, abort early
                    if (info?.abortEarly) {
                      throw null;
                    }

                    // Otherwise, add item to tuple
                  } else {
                    output[tupleIndex] = result.output;
                  }
                }
              }
            })
          ),
      ]).catch(() => null);

      // Return issues or pipe result
      return issues
        ? { issues }
        : executePipeAsync(
            output as TupleOutput<TTupleItems, TTupleRest>,
            pipe,
            getPipeInfo(info, 'tuple')
          );
    },
  };
}
