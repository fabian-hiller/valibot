import type {
  BaseSchema,
  ErrorMessage,
  Issues,
  MaybeReadonly,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';
import type { IntersectInput, IntersectOutput } from './types.ts';
import { mergeOutputs } from './utils/index.ts';

/**
 * Intersect options type.
 */
export type IntersectOptions = MaybeReadonly<
  [BaseSchema, BaseSchema, ...BaseSchema[]]
>;

/**
 * Intersect schema type.
 */
export type IntersectSchema<
  TOptions extends IntersectOptions,
  TOutput = IntersectOutput<TOptions>
> = BaseSchema<IntersectInput<TOptions>, TOutput> & {
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
};

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
      // Create typed, issues, output and outputs
      let typed = true;
      let issues: Issues | undefined;
      let output: any;
      const outputs: any[] = [];

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
            typed = false;
            break;
          }
        }

        // If not typed, set typed to false
        if (!result.typed) {
          typed = false;
        }

        // Set output of option
        outputs.push(result.output);
      }

      // If outputs are typed, merge them
      if (typed) {
        // Set first output as initial output
        output = outputs![0];

        // Merge outputs into one final output
        for (let index = 1; index < outputs!.length; index++) {
          const result = mergeOutputs(output, outputs![index]);

          // If outputs can't be merged, return issue
          if (result.invalid) {
            return schemaIssue(info, 'type', 'intersect', this.message, input);
          }

          // Otherwise, set merged output
          output = result.output;
        }

        // Return typed parse result
        return parseResult(true, output, issues);
      }

      // Otherwise, return untyped parse result
      return parseResult(false, output, issues as Issues);
    },
  };
}

/**
 * See {@link intersect}
 *
 * @deprecated Use `intersect` instead.
 */
export const intersection = intersect;
