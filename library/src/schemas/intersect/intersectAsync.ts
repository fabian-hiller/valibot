import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  MaybeReadonly,
  PipeAsync,
  SchemaIssues,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
  schemaResult,
} from '../../utils/index.ts';
import type { IntersectInput, IntersectOutput } from './types.ts';
import { mergeOutputs } from './utils/index.ts';

/**
 * Intersect options async type.
 */
export type IntersectOptionsAsync = MaybeReadonly<
  [
    BaseSchema | BaseSchemaAsync,
    BaseSchema | BaseSchemaAsync,
    ...(BaseSchema[] | BaseSchemaAsync[])
  ]
>;

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
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<IntersectInput<TOptions>> | undefined;
}

/**
 * Creates an async intersect schema.
 *
 * @param options The intersect options.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async intersect schema.
 */
export function intersectAsync<TOptions extends IntersectOptionsAsync>(
  options: TOptions,
  pipe?: PipeAsync<IntersectInput<TOptions>>
): IntersectSchemaAsync<TOptions>;

/**
 * Creates an async intersect schema.
 *
 * @param options The intersect options.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async intersect schema.
 */
export function intersectAsync<TOptions extends IntersectOptionsAsync>(
  options: TOptions,
  message?: ErrorMessage,
  pipe?: PipeAsync<IntersectInput<TOptions>>
): IntersectSchemaAsync<TOptions>;

export function intersectAsync<TOptions extends IntersectOptionsAsync>(
  options: TOptions,
  arg2?: PipeAsync<IntersectInput<TOptions>> | ErrorMessage,
  arg3?: PipeAsync<IntersectInput<TOptions>>
): IntersectSchemaAsync<TOptions> {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg2, arg3);

  // Create and return intersect schema
  return {
    type: 'intersect',
    expects: [...new Set(options.map((option) => option.expects))].join(' & '),
    async: true,
    options,
    message,
    pipe,
    async _parse(input, config) {
      // Create typed, issues, output and outputs
      let typed = true;
      let issues: SchemaIssues | undefined;
      let output: any;
      const outputs: any[] = [];

      // Parse schema of each option
      await Promise.all(
        this.options.map(async (schema) => {
          // If not aborted early, continue execution
          if (!(config?.abortEarly && issues)) {
            const result = await schema._parse(input, config);

            // If not aborted early, continue execution
            if (!(config?.abortEarly && issues)) {
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
                if (config?.abortEarly) {
                  typed = false;
                  throw null;
                }
              }

              // If not typed, set typed to false
              if (!result.typed) {
                typed = false;
              }

              // Set output of option
              outputs.push(result.output);
            }
          }
        })
      ).catch(() => null);

      // If outputs are typed, merge them
      if (typed) {
        // Set first output as initial output
        output = outputs![0];

        // Merge outputs into one final output
        for (let index = 1; index < outputs!.length; index++) {
          const result = mergeOutputs(output, outputs![index]);

          // If outputs can't be merged, return issue
          if (result.invalid) {
            return schemaIssue(this, intersectAsync, input, config);
          }

          // Otherwise, set merged output
          output = result.output;
        }

        // Execute pipe and return typed schema result
        return pipeResultAsync(this, output, config, issues);
      }

      // Otherwise, return untyped schema result
      return schemaResult(false, output, issues as SchemaIssues);
    },
  };
}

/**
 * See {@link intersectAsync}
 *
 * @deprecated Use `intersectAsync` instead.
 */
export const intersectionAsync = intersectAsync;
