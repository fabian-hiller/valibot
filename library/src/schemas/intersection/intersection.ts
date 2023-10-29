import type { BaseSchema, Issues } from '../../types.ts';
import { getIssues, getOutput, getSchemaIssues } from '../../utils/index.ts';
import type { IntersectionInput, IntersectionOutput } from './types.ts';
import { mergeOutputs } from './utils/index.ts';

/**
 * Intersection options type.
 */
export type IntersectionOptions = [BaseSchema, BaseSchema, ...BaseSchema[]];

/**
 * Intersection schema type.
 */
export type IntersectionSchema<
  TIntersectionOptions extends IntersectionOptions,
  TOutput = IntersectionOutput<TIntersectionOptions>
> = BaseSchema<IntersectionInput<TIntersectionOptions>, TOutput> & {
  schema: 'intersection';
  intersection: TIntersectionOptions;
};

/**
 * Creates an intersection schema.
 *
 * @param intersection The intersection schema.
 * @param error The error message.
 *
 * @returns An intersection schema.
 */
export function intersection<TIntersectionOptions extends IntersectionOptions>(
  intersection: TIntersectionOptions,
  error?: string
): IntersectionSchema<TIntersectionOptions> {
  return {
    /**
     * The schema type.
     */
    schema: 'intersection',

    /**
     * The intersection schema.
     */
    intersection,

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
      // Create issues and outputs
      let issues: Issues | undefined;
      let outputs: [any, ...any] | undefined;

      // Parse schema of each option
      for (const schema of intersection) {
        const result = schema._parse(input, info);

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
            break;
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
