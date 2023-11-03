import type { BaseSchema, BaseSchemaAsync, Issues } from '../../types.ts';
import { getIssues, getOutput, getSchemaIssues } from '../../utils/index.ts';
import type { IntersectInput, IntersectOutput } from './types.ts';
import { mergeOutputs } from './utils/index.ts';

/**
 * Intersect options async type.
 */
export type IntersectOptionsAsync = [
  BaseSchema | BaseSchemaAsync,
  BaseSchema | BaseSchemaAsync,
  ...(BaseSchema[] | BaseSchemaAsync[])
];

/**
 * Intersect schema async type.
 */
export type IntersectSchemaAsync<
  TOptions extends IntersectOptionsAsync,
  TOutput = IntersectOutput<TOptions>
> = BaseSchemaAsync<IntersectInput<TOptions>, TOutput> & {
  type: 'intersect';
  options: TOptions;
};

/**
 * Creates an async intersect schema.
 *
 * @param options The intersect options.
 * @param error The error message.
 *
 * @returns An async intersect schema.
 */
export function intersectAsync<TOptions extends IntersectOptionsAsync>(
  options: TOptions,
  error?: string
): IntersectSchemaAsync<TOptions> {
  return {
    /**
     * The schema type.
     */
    type: 'intersect',

    /**
     * The intersect options.
     */
    options,

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
      // Create issues and outputs
      let issues: Issues | undefined;
      let outputs: [any, ...any] | undefined;

      // Parse schema of each option
      await Promise.all(
        options.map(async (schema) => {
          // If not aborted early, continue execution
          if (!(info?.abortEarly && issues)) {
            const result = await schema._parse(input, info);

            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
              // If there are issues, capture them
              if (result.issues) {
                if (issues) {
                  for (const issue of result.issues) {
                    issues.push(issue);
                  }
                } else {
                  issues = result.issues;
                }

                // If necessary, abort early
                if (info?.abortEarly) {
                  throw null;
                }

                // Otherwise, add output to list
              } else {
                if (outputs) {
                  outputs.push(result.output);
                } else {
                  outputs = [result.output];
                }
              }
            }
          }
        })
      ).catch(() => null);

      // If there are issues, return them
      if (issues) {
        return getIssues(issues);
      }

      // Create output
      let output = outputs![0];

      // Merge outputs into one final output
      for (let index = 1; index < outputs!.length; index++) {
        const result = mergeOutputs(output, outputs![index]);

        // If outputs can't be merged, return issues
        if (result.invalid) {
          return getSchemaIssues(
            info,
            'type',
            'intersect',
            error || 'Invalid type',
            input
          );
        }

        // Otherwise, set merged output
        output = result.output;
      }

      // Return merged output
      return getOutput(output);
    },
  };
}

/**
 * See {@link intersectAsync}
 *
 * @deprecated Use `intersectAsync` instead.
 */
export const intersectionAsync = intersectAsync;
