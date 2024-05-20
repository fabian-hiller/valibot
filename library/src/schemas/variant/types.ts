import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  InferIssue,
  MaybeReadonly,
} from '../../types/index.ts';
import type {
  LooseObjectIssue,
  LooseObjectSchema,
  LooseObjectSchemaAsync,
} from '../looseObject/index.ts';
import type {
  ObjectIssue,
  ObjectSchema,
  ObjectSchemaAsync,
} from '../object/index.ts';
import type {
  ObjectWithRestIssue,
  ObjectWithRestSchema,
  ObjectWithRestSchemaAsync,
} from '../objectWithRest/index.ts';
import type {
  StrictObjectIssue,
  StrictObjectSchema,
  StrictObjectSchemaAsync,
} from '../strictObject/index.ts';
import type { variant } from './variant.ts';
import type { variantAsync } from './variantAsync.ts';

/**
 * Variant issue type.
 */
export interface VariantIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'variant';
  /**
   * The expected property.
   */
  readonly expected: string;
}

/**
 * Variant option schema type.
 */
interface VariantOptionSchema<TKey extends string>
  extends BaseSchema<unknown, unknown, VariantIssue | BaseIssue<unknown>> {
  readonly type: 'variant';
  readonly reference: typeof variant;
  readonly key: string;
  readonly options: VariantOptions<TKey>;
  readonly message: ErrorMessage<VariantIssue> | undefined;
}

/**
 * Variant option schema async type.
 */
interface VariantOptionSchemaAsync<TKey extends string>
  extends BaseSchemaAsync<unknown, unknown, VariantIssue | BaseIssue<unknown>> {
  readonly type: 'variant';
  readonly reference: typeof variantAsync;
  readonly key: string;
  readonly options: VariantOptionsAsync<TKey>;
  readonly message: ErrorMessage<VariantIssue> | undefined;
}

/**
 * Variant option type.
 */
type VariantOption<TKey extends string> =
  | LooseObjectSchema<
      Record<TKey, BaseSchema<unknown, unknown, BaseIssue<unknown>>>,
      ErrorMessage<LooseObjectIssue> | undefined
    >
  | ObjectSchema<
      Record<TKey, BaseSchema<unknown, unknown, BaseIssue<unknown>>>,
      ErrorMessage<ObjectIssue> | undefined
    >
  | ObjectWithRestSchema<
      Record<TKey, BaseSchema<unknown, unknown, BaseIssue<unknown>>>,
      BaseSchema<unknown, unknown, BaseIssue<unknown>>,
      ErrorMessage<ObjectWithRestIssue> | undefined
    >
  | StrictObjectSchema<
      Record<TKey, BaseSchema<unknown, unknown, BaseIssue<unknown>>>,
      ErrorMessage<StrictObjectIssue> | undefined
    >
  | VariantOptionSchema<TKey>;

/**
 * Variant option async type.
 */
type VariantOptionAsync<TKey extends string> =
  | LooseObjectSchemaAsync<
      Record<
        TKey,
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
      >,
      ErrorMessage<LooseObjectIssue> | undefined
    >
  | ObjectSchemaAsync<
      Record<
        TKey,
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
      >,
      ErrorMessage<ObjectIssue> | undefined
    >
  | ObjectWithRestSchemaAsync<
      Record<
        TKey,
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
      >,
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      ErrorMessage<ObjectWithRestIssue> | undefined
    >
  | StrictObjectSchemaAsync<
      Record<
        TKey,
        | BaseSchema<unknown, unknown, BaseIssue<unknown>>
        | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
      >,
      ErrorMessage<StrictObjectIssue> | undefined
    >
  | VariantOptionSchemaAsync<TKey>;

/**
 * Variant options type.
 */
export type VariantOptions<TKey extends string> = MaybeReadonly<
  VariantOption<TKey>[]
>;

/**
 * Variant options async type.
 */
export type VariantOptionsAsync<TKey extends string> = MaybeReadonly<
  (VariantOption<TKey> | VariantOptionAsync<TKey>)[]
>;

/**
 * Infer variant issue type.
 */
export type InferVariantIssue<
  TOptions extends VariantOptions<string> | VariantOptionsAsync<string>,
> = Exclude<
  InferIssue<TOptions[number]>,
  { type: 'loose_object' | 'object' | 'object_with_rest' }
>;
