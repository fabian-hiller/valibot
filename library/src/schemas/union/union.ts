import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Issues,
  Output,
} from '../../types/index.ts';
import { parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Union options type.
 */
export type UnionOptions = [BaseSchema, BaseSchema, ...BaseSchema[]];

/**
 * Union schema type.
 */
export interface UnionSchema<
  TOptions extends UnionOptions,
  TOutput = Output<TOptions[number]>
> extends BaseSchema<Input<TOptions[number]>, TOutput> {
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
}

/**
 * Creates a union schema.
 *
 * @param options The union options.
 * @param message The error message.
 *
 * @returns A union schema.
 */
export function union<TOptions extends UnionOptions>(
  options: TOptions,
  message: ErrorMessage = 'Invalid type'
): UnionSchema<TOptions> {
  return {
    type: 'union',
    async: false,
    options,
    message,
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

      // If there is an output, return parse result
      if (output) {
        return parseResult(true, output[0]);
      }

      // Otherwise, return schema issue
      return schemaIssue(info, 'type', 'union', this.message, input, issues);
    },
  };
}
