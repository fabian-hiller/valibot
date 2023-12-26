import type {
  BaseSchema,
  ErrorMessage,
  Issues,
  MaybeReadonly,
  Pipe,
} from '../../types/index.ts';
import {
  defaultArgs,
  parseResult,
  pipeResult,
  schemaIssue,
} from '../../utils/index.ts';
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
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<IntersectInput<TOptions>> | undefined;
};

/**
 * Creates an intersect schema.
 *
 * @param options The intersect options.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An intersect schema.
 */
export function intersect<TOptions extends IntersectOptions>(
  options: TOptions,
  pipe?: Pipe<IntersectInput<TOptions>>
): IntersectSchema<TOptions>;

/**
 * Creates an intersect schema.
 *
 * @param options The intersect options.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An intersect schema.
 */
export function intersect<TOptions extends IntersectOptions>(
  options: TOptions,
  message?: ErrorMessage,
  pipe?: Pipe<IntersectInput<TOptions>>
): IntersectSchema<TOptions>;

export function intersect<TOptions extends IntersectOptions>(
  options: TOptions,
  arg2?: Pipe<IntersectInput<TOptions>> | ErrorMessage,
  arg3?: Pipe<IntersectInput<TOptions>>
): IntersectSchema<TOptions> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = defaultArgs(arg2, arg3);

  // Create and return intersect schema
  return {
    type: 'intersect',
    async: false,
    options,
    message,
    pipe,
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

        // Execute pipe and return typed parse result
        return pipeResult(output, this.pipe, info, 'intersect', issues);
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
