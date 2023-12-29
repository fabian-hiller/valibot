import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  Issues,
  MaybeReadonly,
  Output,
  PipeAsync,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';

/**
 * Union options async type.
 */
export type UnionOptionsAsync = MaybeReadonly<(BaseSchema | BaseSchemaAsync)[]>;

/**
 * Union schema async type.
 */
export type UnionSchemaAsync<
  TOptions extends UnionOptionsAsync,
  TOutput = Output<TOptions[number]>
> = BaseSchemaAsync<Input<TOptions[number]>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'union';
  /**
   * The union options.
   */
  options: TOptions;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<Input<TOptions[number]>> | undefined;
};

/**
 * Creates an async union schema.
 *
 * @param options The union options.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async union schema.
 */
export function unionAsync<TOptions extends UnionOptionsAsync>(
  options: TOptions,
  pipe?: PipeAsync<Input<TOptions[number]>>
): UnionSchemaAsync<TOptions>;

/**
 * Creates an async union schema.
 *
 * @param options The union options.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async union schema.
 */
export function unionAsync<TOptions extends UnionOptionsAsync>(
  options: TOptions,
  message?: ErrorMessage,
  pipe?: PipeAsync<Input<TOptions[number]>>
): UnionSchemaAsync<TOptions>;

export function unionAsync<TOptions extends UnionOptionsAsync>(
  options: TOptions,
  arg2?: PipeAsync<Input<TOptions[number]>> | ErrorMessage,
  arg3?: PipeAsync<Input<TOptions[number]>>
): UnionSchemaAsync<TOptions> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = defaultArgs(arg2, arg3);

  // Create and return union schema
  return {
    type: 'union',
    async: true,
    options,
    message,
    pipe,
    async _parse(input, info) {
      // Create issues and output
      let issues: Issues | undefined;
      let output: [Output<TOptions[number]>] | undefined;

      // Parse schema of each option
      for (const schema of this.options) {
        const result = await schema._parse(input, info);

        // If there are issues, capture them
        if (result.issues) {
          if (issues) {
            for (const issue of result.issues) {
              issues.push(issue);
            }
          } else {
            issues = result.issues;
          }

          // Otherwise, set output and break loop
        } else {
          // Note: Output is nested in array, so that also a falsy value
          // further down can be recognized as valid value
          output = [result.output];
          break;
        }
      }

      // If there is an output, execute pipe
      if (output) {
        return pipeResultAsync(output[0], this.pipe, info, 'union');
      }

      // Otherwise, return schema issue
      return schemaIssue(
        info,
        'type',
        'union',
        this.message,
        input,
        undefined,
        issues
      );
    },
  };
}
