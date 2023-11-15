import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Issues,
  Output,
} from '../../types/index.ts';
import { getSchemaIssues, getOutput, getIssues } from '../../utils/index.ts';
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
};

/**
 * Creates a variant (aka discriminated union) schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param message The error message.
 *
 * @returns A variant schema.
 */
export function variant<
  TKey extends string,
  TOptions extends VariantOptions<TKey>
>(
  key: TKey,
  options: TOptions,
  message: ErrorMessage = 'Invalid type'
): VariantSchema<TKey, TOptions> {
  return {
    type: 'variant',
    async: false,
    key,
    options,
    message,
    _parse(input, info) {
      // Check type of input
      if (!input || typeof input !== 'object' || !(this.key in input)) {
        return getSchemaIssues(info, 'type', 'variant', this.message, input);
      }

      // Create issues and output
      let issues: Issues | undefined;
      let output: [Record<string, any>] | undefined;

      // Create function to parse options recursively
      const parseOptions = (options: VariantOptions<TKey>) => {
        for (const schema of options) {
          // If it is an object schema, parse discriminator key
          if (schema.type === 'object') {
            const result = schema.entries[this.key]._parse(
              (input as Record<TKey, unknown>)[this.key],
              info
            );

            // If right variant option was found, parse it
            if (!result.issues) {
              const result = schema._parse(input, info);

              // If there are issues, capture them
              if (result.issues) {
                issues = result.issues;

                // Otherwise, set output
              } else {
                // Note: Output is nested in array, so that also a falsy value
                // further down can be recognized as valid value
                output = [result.output];
              }

              // Break loop to end execution
              break;
            }

            // Otherwise, if it is a variant parse its options
            // recursively
          } else if (schema.type === 'variant') {
            parseOptions(schema.options);

            // If variant option was found, break loop to end execution
            if (issues || output) {
              break;
            }
          }
        }
      };

      // Parse options recursively
      parseOptions(this.options);

      // Return output or issues
      return output
        ? getOutput(output[0])
        : issues
        ? getIssues(issues)
        : getSchemaIssues(info, 'type', 'variant', this.message, input);
    },
  };
}

/**
 * See {@link variant}
 *
 * @deprecated Use `variant` instead.
 */
export const discriminatedUnion = variant;
