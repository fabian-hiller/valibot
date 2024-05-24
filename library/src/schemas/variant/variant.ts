import type {
  BaseIssue,
  BaseSchema,
  Dataset,
  ErrorMessage,
  InferInput,
  InferOutput,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type {
  InferVariantIssue,
  VariantIssue,
  VariantOptions,
} from './types.ts';
import { _discriminators } from './utils/index.ts';

/**
 * Variant schema type.
 */
export interface VariantSchema<
  TKey extends string,
  TOptions extends VariantOptions<TKey>,
  TMessage extends ErrorMessage<VariantIssue> | undefined,
> extends BaseSchema<
    InferInput<TOptions[number]>,
    InferOutput<TOptions[number]>,
    VariantIssue | InferVariantIssue<TOptions>
  > {
  /**
   * The schema type.
   */
  readonly type: 'variant';
  /**
   * The schema reference.
   */
  readonly reference: typeof variant;
  /**
   * The discriminator key.
   */
  readonly key: TKey;
  /**
   * The variant options.
   */
  readonly options: TOptions;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a variant schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 *
 * @returns A variant schema.
 */
export function variant<
  const TKey extends string,
  const TOptions extends VariantOptions<TKey>,
>(key: TKey, options: TOptions): VariantSchema<TKey, TOptions, undefined>;

/**
 * Creates a variant schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param message The error message.
 *
 * @returns An variant schema.
 */
export function variant<
  const TKey extends string,
  const TOptions extends VariantOptions<TKey>,
  const TMessage extends ErrorMessage<VariantIssue> | undefined,
>(
  key: TKey,
  options: TOptions,
  message: TMessage
): VariantSchema<TKey, TOptions, TMessage>;

export function variant(
  key: string,
  options: VariantOptions<string>,
  message?: ErrorMessage<VariantIssue>
): VariantSchema<
  string,
  VariantOptions<string>,
  ErrorMessage<VariantIssue> | undefined
> {
  let expectedDiscriminators: string | undefined;
  return {
    kind: 'schema',
    type: 'variant',
    reference: variant,
    expects: 'Object',
    async: false,
    key,
    options,
    message,
    _run(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (input && typeof input === 'object' && input.constructor === Object) {
        // Get discriminator from input
        // @ts-expect-error
        const discriminator: unknown = input[this.key];

        // If key is in input, parse schema of each option
        if (this.key in input) {
          // Create output dataset variable
          let outputDataset: Dataset<unknown, BaseIssue<unknown>> | undefined;

          // Parse only if it is a variant schema or if discriminator matches
          for (const schema of this.options) {
            if (
              schema.type === 'variant' ||
              !schema.entries[this.key]._run(
                { typed: false, value: discriminator },
                config
              ).issues
            ) {
              // Parse input with schema of option
              const optionDataset = schema._run(
                { typed: false, value: input },
                config
              );

              // If valid option is found, return its dataset
              if (!optionDataset.issues) {
                return optionDataset;
              }

              // Otherwise, replace output dataset if necessary
              // TODO: Document that only first untyped or typed dataset is
              // returned and that typed datasets are prioritized
              if (
                !outputDataset ||
                (!outputDataset.typed && optionDataset.typed)
              ) {
                outputDataset = optionDataset;
              }
            }
          }

          // If any output dataset is available, return it
          if (outputDataset) {
            return outputDataset;
          }
        }

        // Otherwise, cache expected discriminators if necessary
        if (!expectedDiscriminators) {
          expectedDiscriminators =
            [..._discriminators(this.key, this.options)].join(' | ') || 'never';
        }

        // And add discriminator issue
        _addIssue(this, 'type', dataset, config, {
          input: discriminator,
          expected: expectedDiscriminators,
          path: [
            {
              type: 'object',
              origin: 'value',
              input: input as Record<string, unknown>,
              key: this.key,
              value: discriminator,
            },
          ],
        });

        // Otherwise, add variant issue
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // Return output dataset
      return dataset as Dataset<
        InferOutput<VariantOptions<string>[number]>,
        VariantIssue | BaseIssue<unknown>
      >;
    },
  };
}
