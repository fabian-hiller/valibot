import type {
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  InferIssue,
  MaybeReadonly,
} from '../../types/index.ts';
import type {
  LooseObjectIssue,
  LooseObjectSchema,
} from '../looseObject/index.ts';
import type { ObjectIssue, ObjectSchema } from '../object/index.ts';
import type {
  ObjectWithRestIssue,
  ObjectWithRestSchema,
} from '../objectWithRest/index.ts';
import type {
  StrictObjectIssue,
  StrictObjectSchema,
} from '../strictObject/index.ts';
import type { variant } from './variant.ts';

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
 * Variant options type.
 */
export type VariantOptions<TKey extends string> = MaybeReadonly<
  VariantOption<TKey>[]
>;

/**
 * Infer variant issue type.
 */
export type InferVariantIssue<TOptions extends VariantOptions<string>> =
  Exclude<
    InferIssue<TOptions[number]>,
    { type: 'loose_object' | 'object' | 'object_with_rest' }
  >;
