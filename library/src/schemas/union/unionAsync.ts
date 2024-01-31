import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  MaybeReadonly,
  Output,
  PipeAsync,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';
import { subissues } from './utils/index.ts';

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
  message: ErrorMessage | undefined;
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
  const [message, pipe] = defaultArgs(arg2, arg3);

  // Create and return union schema
  return {
    type: 'union',
    expects: options.map((option) => option.expects).join(' | '),
    async: true,
    options,
    message,
    pipe,
    async _parse(input, config) {
      // Create variables to collect results
      let validResult: TypedSchemaResult<Output<TOptions[number]>> | undefined;
      let untypedResults: UntypedSchemaResult[] | undefined;
      let typedResults:
        | TypedSchemaResult<Output<TOptions[number]>>[]
        | undefined;

      // Parse schema of each option
      for (const schema of this.options) {
        const result = await schema._parse(input, config);

        // If typed, add valid or typed result
        if (result.typed) {
          // If there are no issues, add valid result and break loop
          if (!result.issues) {
            validResult = result;
            break;

            // Otherwise, add typed result
          } else {
            typedResults
              ? typedResults.push(result)
              : (typedResults = [result]);
          }

          // Otherwise, add untyped result
        } else {
          untypedResults
            ? untypedResults.push(result)
            : (untypedResults = [result]);
        }
      }

      // If there is a valid result, execute pipe
      if (validResult) {
        return pipeResultAsync(this, input, config);
      }

      // If there are typed results, execute pipe
      if (typedResults?.length) {
        const firstResult = typedResults[0];
        return pipeResultAsync(
          this,
          firstResult.output,
          config,
          // Hint: If there is more than one typed result, we use a general
          // union issue with subissues because the issues could contradict
          // each other.
          typedResults.length === 1
            ? firstResult.issues
            : schemaIssue(this, unionAsync, input, config, {
                reason: 'union',
                issues: subissues(typedResults),
              }).issues
        );
      }

      // If there is only one untyped result, return it
      if (untypedResults?.length === 1) {
        return untypedResults[0];
      }

      // Otherwise, return schema issue
      // Hint: If there are zero or more than one untyped results, we use a
      // general union issue with subissues because the issues could contradict
      // each other.
      return schemaIssue(this, unionAsync, input, config, {
        issues: subissues(untypedResults),
      });
    },
  };
}
