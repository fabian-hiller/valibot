import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Issues,
  Output,
} from '../../types.ts';
import { getSchemaIssues, getOutput, getIssues } from '../../utils/index.ts';
import type { ObjectSchema } from '../object/index.ts';

/**
 * TODO: Finde ich hierfür noch einen kürzeren Namen? Was nutzen anderen Libraries wie TypeBox? AI Tools nutzen!
 * - variant (best)
 * - sum
 * - dUnion
 * - choice
 * - tagged union
 * - coproduct
 *
 *
 * Kann es sinn machen auch einen Array mit Keys zu erlauben?
 * - z.B. für `type` and `kind` Strukture in Valibot?
 */

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
  type: 'variant';
  /**
   * The variant options.
   */
  options: TOptions;
};

/**
 * Creates a variant (aka discriminated union) schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param error The error message.
 *
 * @returns A variant schema.
 */
export function variant<
  TKey extends string,
  TOptions extends VariantOptions<TKey>
>(
  key: TKey,
  options: TOptions,
  error?: ErrorMessage
): VariantSchema<TKey, TOptions> {
  return {
    type: 'variant',
    async: false,
    options,
    _parse(input, info) {
      // Check type of input
      if (!input || typeof input !== 'object' || !(key in input)) {
        return getSchemaIssues(
          info,
          'type',
          'variant',
          error || 'Invalid type',
          input
        );
      }

      // Create issues and output
      let issues: Issues | undefined;
      let output: [Record<string, any>] | undefined;

      // Create function to parse options recursively
      const parseOptions = (options: VariantOptions<TKey>) => {
        for (const schema of options) {
          // If it is an object schema, parse discriminator key
          if (schema.type === 'object') {
            const result = schema.entries[key]._parse(
              (input as Record<TKey, unknown>)[key],
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
      parseOptions(options);

      // Return output or issues
      return output
        ? getOutput(output[0])
        : issues
        ? getIssues(issues)
        : getSchemaIssues(
            info,
            'type',
            'variant',
            error || 'Invalid type',
            input
          );
    },
  };
}

/**
 * See {@link variant}
 *
 * @deprecated Use `variant` instead.
 */
export const discriminatedUnion = variant;
