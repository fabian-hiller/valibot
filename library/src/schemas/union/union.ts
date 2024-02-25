import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Input,
  MaybeReadonly,
  Output,
  Pipe,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';
import { subissues } from './utils/index.ts';

/**
 * Union options type.
 */
export type UnionOptions = MaybeReadonly<BaseSchema[]>;

/**
 * Union schema type.
 */
export type UnionSchema<
  TOptions extends UnionOptions,
  TOutput = Output<TOptions[number]>,
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
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<Output<TOptions[number]>> | undefined;
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
  pipe?: Pipe<Output<TOptions[number]>>
): UnionSchema<TOptions>;

/**
 * Creates a union schema.
 *
 * @param options The union options.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A union schema.
 */
export function union<TOptions extends UnionOptions>(
  options: TOptions,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<Output<TOptions[number]>>
): UnionSchema<TOptions>;

export function union<TOptions extends UnionOptions>(
  options: TOptions,
  arg2?: Pipe<Output<TOptions[number]>> | ErrorMessageOrMetadata,
  arg3?: Pipe<Output<TOptions[number]>>
): UnionSchema<TOptions> {
  // Get message and pipe argument
  const [message, pipe, metadata] = defaultArgs(arg2, arg3);

  // Create and return union schema
  return {
    type: 'union',
    expects: [...new Set(options.map((option) => option.expects))].join(' | '),
    async: false,
    options,
    message,
    pipe,
    metadata,
    _parse(input, config) {
      // Create variables to collect results
      let validResult: TypedSchemaResult<Output<TOptions[number]>> | undefined;
      let untypedResults: UntypedSchemaResult[] | undefined;
      let typedResults:
        | TypedSchemaResult<Output<TOptions[number]>>[]
        | undefined;

      // Parse schema of each option
      for (const schema of this.options) {
        const result = schema._parse(input, config);

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

      // If there is a valid result, return pipe result
      if (validResult) {
        return pipeResult(this, validResult.output, config);
      }

      // If there are typed results, return pipe result
      if (typedResults?.length) {
        const firstResult = typedResults[0];
        return pipeResult(
          this,
          firstResult.output,
          config,
          // Hint: If there is more than one typed result, we use a general
          // union issue with subissues because the issues could contradict
          // each other.
          typedResults.length === 1
            ? firstResult.issues
            : schemaIssue(this, union, input, config, {
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
      return schemaIssue(this, union, input, config, {
        issues: subissues(untypedResults),
      });
    },
  };
}
