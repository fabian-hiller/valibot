import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Issues,
  Output,
  Pipe,
} from '../../types/index.ts';
import {
  defaultArgs,
  parseResult,
  pipeResult,
  schemaIssue,
} from '../../utils/index.ts';
import type { ObjectSchema } from '../object/index.ts';

/**
 * Variant option type.
 */
export type VariantOption<TKey extends string> =
  | ObjectSchema<Record<TKey, BaseSchema>, any>
  | (BaseSchema & {
      type: 'variant';
      options: VariantOptions<TKey>;
    });

/**
 * Variant options type.
 */
export type VariantOptions<TKey extends string> = [
  VariantOption<TKey>,
  VariantOption<TKey>,
  ...VariantOption<TKey>[]
];

/**
 * Variant schema type.
 */
export type VariantSchema<
  TKey extends string,
  TOptions extends VariantOptions<TKey>,
  TOutput = Output<TOptions[number]>
> = BaseSchema<Input<TOptions[number]>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'variant';
  /**
   * The discriminator key.
   */
  key: TKey;
  /**
   * The variant options.
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
 * Creates a variant (aka discriminated union) schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A variant schema.
 */
export function variant<
  TKey extends string,
  TOptions extends VariantOptions<TKey>
>(
  key: TKey,
  options: TOptions,
  pipe?: Pipe<Input<TOptions[number]>>
): VariantSchema<TKey, TOptions>;

/**
 * Creates a variant (aka discriminated union) schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A variant schema.
 */
export function variant<
  TKey extends string,
  TOptions extends VariantOptions<TKey>
>(
  key: TKey,
  options: TOptions,
  message?: ErrorMessage,
  pipe?: Pipe<Input<TOptions[number]>>
): VariantSchema<TKey, TOptions>;

export function variant<
  TKey extends string,
  TOptions extends VariantOptions<TKey>
>(
  key: TKey,
  options: TOptions,
  arg3?: Pipe<Input<TOptions[number]>> | ErrorMessage,
  arg4?: Pipe<Input<TOptions[number]>>
): VariantSchema<TKey, TOptions> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = defaultArgs(arg3, arg4);

  // Create and return variant schema
  return {
    type: 'variant',
    async: false,
    key,
    options,
    message,
    pipe,
    _parse(input, info) {
      // Check type of input
      if (!input || typeof input !== 'object' || !(this.key in input)) {
        return schemaIssue(info, 'type', 'variant', this.message, input);
      }

      // Create issues and output
      let issues: Issues | undefined;
      let output: [Record<string, any>] | undefined;

      // Create function to parse options recursively
      const parseOptions = (options: VariantOptions<TKey>) => {
        for (const schema of options) {
          // If it is an object schema, parse discriminator key
          if (schema.type === 'object') {
            const keyResult = schema.entries[this.key]._parse(
              (input as Record<TKey, unknown>)[this.key],
              info
            );

            // If right variant option was found, parse it
            if (!keyResult.issues) {
              const dataResult = schema._parse(input, info);

              // If there are issues, capture them
              if (dataResult.issues) {
                issues = dataResult.issues;

                // Otherwise, set output
              } else {
                // Note: Output is nested in array, so that also a falsy value
                // further down can be recognized as valid value
                output = [dataResult.output!];

                // Break loop to end execution
                break;
              }
            }

            // Otherwise, if it is a variant parse its options
            // recursively
          } else if (schema.type === 'variant') {
            parseOptions(schema.options);

            // If variant option was found, break loop to end execution
            if (output) {
              break;
            }
          }
        }
      };

      // Parse options recursively
      parseOptions(this.options);

      // If there is an output, execute pipe
      if (output) {
        return pipeResult(output[0], this.pipe, info, 'variant');
      }

      // If there are issues, return untyped parse result
      if (issues) {
        return parseResult(false, output, issues);
      }

      // If discriminator key is invalid, return issue
      return schemaIssue(info, 'type', 'variant', this.message, input);
    },
  };
}

/**
 * See {@link variant}
 *
 * @deprecated Use `variant` instead.
 */
export const discriminatedUnion = variant;
