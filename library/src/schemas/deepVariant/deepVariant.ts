import { BaseIssue, BaseSchema, ErrorMessage, InferInput, InferIssue, InferOutput, MaybeReadonly, ObjectEntries, OptionalEntrySchema, OutputDataset } from "../../types";
import { _addIssue, _getStandardProps } from "../../utils";
import { literal } from "../literal";
import { LooseObjectIssue, LooseObjectSchema } from "../looseObject";
import { number } from "../number";
import { object, ObjectIssue, ObjectSchema } from "../object";
import { ObjectWithRestIssue, ObjectWithRestSchema } from "../objectWithRest";
import { StrictObjectIssue, StrictObjectSchema } from "../strictObject";

/**
 * Variant issue interface.
 */
export interface DeepVariantIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'deepVariant';
  /**
   * The expected property.
   */
  readonly expected: string;
}


export interface DeepVariantOptionSchema<TPath extends string>
  extends BaseSchema<unknown, unknown, DeepVariantIssue | BaseIssue<unknown>> {
  readonly type: 'deepVariant';
  readonly reference: typeof deepVariant;
  readonly path: string;
  readonly options: DeepVariantOptions;
  readonly message: ErrorMessage<DeepVariantIssue> | undefined;
}

/**
 * Variant object entries type.
 */
type DeepVariantObjectEntries = Record<
  string,
  BaseSchema<unknown, unknown, BaseIssue<unknown>> | OptionalEntrySchema
> &
  ObjectEntries;

type DeepVariantOption =
| LooseObjectSchema<
    DeepVariantObjectEntries,
    ErrorMessage<LooseObjectIssue> | undefined
  >
| ObjectSchema<
    DeepVariantObjectEntries,
    ErrorMessage<ObjectIssue> | undefined
  >
| ObjectWithRestSchema<
    DeepVariantObjectEntries,
    BaseSchema<unknown, unknown, BaseIssue<unknown>>,
    ErrorMessage<ObjectWithRestIssue> | undefined
  >
| StrictObjectSchema<
    DeepVariantObjectEntries,
    ErrorMessage<StrictObjectIssue> | undefined
  >;

type DeepVariantOptions = MaybeReadonly<
  DeepVariantOption[]
>



/**
 * Infer variant issue type.
 */
export type InferDeepVariantIssue<
  TOptions extends DeepVariantOptions,
> = Exclude<
  InferIssue<TOptions[number]>,
  { type: 'loose_object' | 'object' | 'object_with_rest' }
>;


/**
 * Variant schema interface.
 */
export interface DeepVariantSchema<
  TPath extends string,
  TOptions extends DeepVariantOptions,
  TMessage extends ErrorMessage<DeepVariantIssue> | undefined,
> extends BaseSchema<
    InferInput<TOptions[number]>,
    InferOutput<TOptions[number]>,
    DeepVariantIssue | InferDeepVariantIssue<TOptions>
  > {
  /**
   * The schema type.
   */
  readonly type: 'deepVariant';
  /**
   * The schema reference.
   */
  readonly reference: typeof deepVariant;
  /**
   * The expected property.
   */
  readonly expects: 'Object';
  /**
   * The discriminator key.
   */
  readonly path: TPath;
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
 * @param path The discriminator path.
 * @param options The variant options.
 *
 * @returns A variant schema.
 */
export function deepVariant<
  const TPath extends string,
  const TOptions extends DeepVariantOptions,
>(path: TPath, options: TOptions): DeepVariantSchema<TPath, TOptions, undefined>;

/**
 * Creates a variant schema.
 *
 * @param path The discriminator path.
 * @param options The variant options.
 * @param message The error message.
 *
 * @returns An variant schema.
 */
export function deepVariant<
  const TPath extends string,
  const TOptions extends DeepVariantOptions,
  const TMessage extends ErrorMessage<DeepVariantIssue> | undefined,
>(
  path: TPath,
  options: TOptions,
  message: TMessage
): DeepVariantSchema<TPath, TOptions, TMessage>;

export function deepVariant(
  path: string, options: DeepVariantOptions, message?: string
): DeepVariantSchema<
  string,
  DeepVariantOptions,
  ErrorMessage<DeepVariantIssue> | undefined
>{
  return {
    kind: 'schema',
    type: 'deepVariant',
    reference: deepVariant,
    expects: 'Object',
    async: false,
    path,
    options,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {

      const input = dataset.value;

      if (!input || typeof input !== 'object') {
        _addIssue(this, 'type', dataset, config);
        return;
      }


      const parseOptions = (
        variant: DeepVariantOptionSchema<string>,
        path: string
      ) => {
        for (const schema of variant.options) {
          let keyIsValid = true;
  
          const pathParts = path.split(".");
          let currentSchemaEntries = schema.entries;
          let _input = input;
          while (pathParts.length) {
            const pathPart = pathParts[0];
            const discriminatorSchema = currentSchemaEntries[pathPart];
            const currentInputAtCurrentDepth = _input;
            if (pathPart in currentInputAtCurrentDepth) {
              console.log(pathPart, discriminatorSchema)
  
              if (pathParts.length === 1) {
                const iss = discriminatorSchema["~run"](
                  // @ts-expect-error
                  { typed: false, value: currentInputAtCurrentDepth[pathPart] },
                  config
                ).issues;
                if (!iss) {
                  return schema;
                }
              }
  
              // @ts-expect-error
              _input = currentInputAtCurrentDepth[pathPart];
              currentSchemaEntries = discriminatorSchema.entries;
            } else {
              keyIsValid = false;
              break;
            }
            pathParts.shift();
          }
          
        }
      }

      const schemaToUse = parseOptions(this, this.path);
      if (!schemaToUse) {
        throw new Error('');
      }

      if (
        schemaToUse["~run"]({ typed: false, value: input }, config).issues
      ) {
        // _addIssue({}, {})
      }


      // @ts-expect-error
      return dataset as OutputDataset<
        InferOutput<DeepVariantOptions[number]>,
        DeepVariantIssue | BaseIssue<unknown>
      >
    }
  }
}
