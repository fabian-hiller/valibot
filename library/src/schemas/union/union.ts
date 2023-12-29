import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Issues,
  MaybeReadonly,
  Output,
  Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Union options type.
 */
export type UnionOptions = MaybeReadonly<BaseSchema[]>;

/**
 * Union schema type.
 */
export type UnionSchema<
  TOptions extends UnionOptions,
  TOutput = Output<TOptions[number]>
> = BaseSchema<Input<TOptions[number]>, TOutput> & {
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
  pipe: Pipe<Input<TOptions[number]>> | undefined;
};

/**
 * Creates a union schema.
 *
 * @param options The union options.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A union schema.
 */
export function union<TOptions extends UnionOptions>(
  options: TOptions,
  pipe?: Pipe<Input<TOptions[number]>>
): UnionSchema<TOptions>;

/**
 * Creates a union schema.
 *
 * @param options The union options.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A union schema.
 */
export function union<TOptions extends UnionOptions>(
  options: TOptions,
  message?: ErrorMessage,
  pipe?: Pipe<Input<TOptions[number]>>
): UnionSchema<TOptions>;

export function union<TOptions extends UnionOptions>(
  options: TOptions,
  arg2?: Pipe<Input<TOptions[number]>> | ErrorMessage,
  arg3?: Pipe<Input<TOptions[number]>>
): UnionSchema<TOptions> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = defaultArgs(arg2, arg3);

  // Create and return union schema
  return {
    type: 'union',
    async: false,
    options,
    message,
    pipe,
    _parse(input, info) {
      // Create issues and output
      let issues: Issues | undefined;
      let output: [Output<TOptions[number]>] | undefined;

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
        return pipeResult(output[0], this.pipe, info, 'union');
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
