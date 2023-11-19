import type { BaseSchema, ErrorMessage, Issues } from '../../types/index.ts';
import { getIssues, getOutput, getSchemaIssues } from '../../utils/index.ts';
import type { IntersectInput, IntersectOutput } from './types.ts';
import { mergeOutputs } from './utils/index.ts';

/**
 * Intersect options type.
 */
export type IntersectOptions = [BaseSchema, BaseSchema, ...BaseSchema[]];

/**
 * Intersect schema type.
 */
export interface IntersectSchema<
  TOptions extends IntersectOptions,
  TOutput = IntersectOutput<TOptions>
> extends BaseSchema<IntersectInput<TOptions>, TOutput> {
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
 * Creates an intersect schema.
 *
 * @param options The intersect options.
 * @param message The error message.
 *
 * @returns An intersect schema.
 */
export function intersect<TOptions extends IntersectOptions>(
  options: TOptions,
  message: ErrorMessage = 'Invalid type'
): IntersectSchema<TOptions> {
  return {
    type: 'intersect',
    async: false,
    options,
    message,
    _parse(input, info) {
      // Create issues and outputs
      let issues: Issues | undefined;
      let outputs: [any, ...any] | undefined;

      // Parse schema of each option
      for (const schema of this.options) {
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
 * See {@link intersect}
 *
 * @deprecated Use `intersect` instead.
 */
export const intersection = intersect;
