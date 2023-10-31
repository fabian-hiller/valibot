import type { BaseSchema, BaseSchemaAsync, Issues } from '../../types.ts';
import { getIssues, getOutput, getSchemaIssues } from '../../utils/index.ts';
import type { IntersectionInput, IntersectionOutput } from './types.ts';
import { mergeOutputs } from './utils/index.ts';

/**
 * Intersection options async type.
 */
export type IntersectionOptionsAsync = [
  BaseSchema | BaseSchemaAsync,
  BaseSchema | BaseSchemaAsync,
  ...(BaseSchema[] | BaseSchemaAsync[])
];

/**
 * Intersection schema async type.
 */
export type IntersectionSchemaAsync<
  TOptions extends IntersectionOptionsAsync,
  TOutput = IntersectionOutput<TOptions>
> = BaseSchemaAsync<IntersectionInput<TOptions>, TOutput> & {
  type: 'intersection';
  options: TOptions;
};

/**
 * Creates an async intersection schema.
 *
 * @param options The intersection options.
 * @param error The error message.
 *
 * @returns An async intersection schema.
 */
export function intersectionAsync<TOptions extends IntersectionOptionsAsync>(
  options: TOptions,
  error?: string
): IntersectionSchemaAsync<TOptions> {
  return {
    /**
     * The schema type.
     */
    type: 'intersection',

    /**
     * The intersection options.
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
            'intersection',
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
