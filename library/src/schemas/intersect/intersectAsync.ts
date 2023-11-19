import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Issues,
} from '../../types/index.ts';
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
export interface IntersectSchemaAsync<
  TOptions extends IntersectOptionsAsync,
  TOutput = IntersectOutput<TOptions>
> extends BaseSchemaAsync<IntersectInput<TOptions>, TOutput> {
  /**
   * The schema type.
   */
  type: 'intersect';
  /**
   * The intersect options.
   */
  options: TOptions;
  /**
   * The error message.
   */
  message: ErrorMessage;
}

/**
 * Creates an async intersect schema.
 *
 * @param options The intersect options.
 * @param message The error message.
 *
 * @returns An async intersect schema.
 */
export function intersectAsync<TOptions extends IntersectOptionsAsync>(
  options: TOptions,
  message: ErrorMessage = 'Invalid type'
): IntersectSchemaAsync<TOptions> {
  return {
    type: 'intersect',
    async: true,
    options,
    message,
    async _parse(input, info) {
      // Create issues and outputs
      let issues: Issues | undefined;
      let outputs: [any, ...any] | undefined;

      // Parse schema of each option
      await Promise.all(
        this.options.map(async (schema) => {
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
            this.message,
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
