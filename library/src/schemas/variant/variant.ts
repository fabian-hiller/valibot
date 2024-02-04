import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Input,
  Output,
  Pipe,
  SchemaResult,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';
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
  pipe: Pipe<Output<TOptions[number]>> | undefined;
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
  pipe?: Pipe<Output<TOptions[number]>>
): VariantSchema<TKey, TOptions>;

/**
 * Creates a variant (aka discriminated union) schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param messageOrMetadata The error message or schema metadata.
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
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<Output<TOptions[number]>>
): VariantSchema<TKey, TOptions>;

export function variant<
  TKey extends string,
  TOptions extends VariantOptions<TKey>
>(
  key: TKey,
  options: TOptions,
  arg3?: Pipe<Output<TOptions[number]>> | ErrorMessageOrMetadata,
  arg4?: Pipe<Output<TOptions[number]>>
): VariantSchema<TKey, TOptions> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe, metadata] = defaultArgs(arg3, arg4);

  // Create and return variant schema
  return {
    type: 'variant',
    async: false,
    key,
    options,
    message,
    pipe,
    metadata,
    _parse(input, info) {
      // Check type of input
      if (!input || typeof input !== 'object') {
        return schemaIssue(info, 'type', 'variant', this.message, input);
      }

      // Continue if discriminator key is included
      if (this.key in input) {
        // Create variable to store variant result
        let variantResult: SchemaResult<Output<TOptions[number]>> | undefined;

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

                // If there are not issues, store result and break loop
                if (!dataResult.issues) {
                  variantResult = dataResult;
                  break;
                }

                // Otherwise, replace variant result only if necessary
                if (
                  !variantResult ||
                  (!variantResult.typed && dataResult.typed)
                ) {
                  variantResult = dataResult;
                }
              }

              // Otherwise, if it is a variant parse its options
              // recursively
            } else if (schema.type === 'variant') {
              parseOptions(schema.options);

              // If variant option was found, break loop to end execution
              if (variantResult && !variantResult.issues) {
                break;
              }
            }
          }
        };

        // Parse options recursively
        parseOptions(this.options);

        // If a variant result is available, process it
        if (variantResult) {
          // If result is typed, execute pipe
          if (variantResult.typed) {
            return pipeResult(
              variantResult.output,
              this.pipe,
              info,
              'variant',
              variantResult.issues
            );
          }

          // Otherwise, return variant result
          return variantResult;
        }
      }

      // If discriminator key is invalid, return issue
      return schemaIssue(info, 'type', 'variant', this.message, input, [
        {
          type: 'object',
          input: input as Record<string, unknown>,
          key: this.key,
          value: undefined,
        },
      ]);
    },
  };
}

/**
 * See {@link variant}
 *
 * @deprecated Use `variant` instead.
 */
export const discriminatedUnion = variant;
