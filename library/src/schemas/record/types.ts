import type { Brand } from '../../actions/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  InferInput,
  InferOutput,
  ResolveObject,
} from '../../types/index.ts';

/**
 * Record issue type.
 */
export interface RecordIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'record';
  /**
   * The expected input.
   */
  readonly expected: 'Object';
}

/**
 * Record path item type.
 */
export interface RecordPathItem {
  /**
   * The path item type.
   */
  readonly type: 'record';
  /**
   * The path item origin.
   */
  readonly origin: 'key' | 'value';
  /**
   * The path item input.
   */
  readonly input: Record<string, unknown>;
  /**
   * The path item key.
   */
  readonly key: string;
  /**
   * The path item value.
   */
  readonly value: unknown;
}

/**
 * Is literal type.
 */
type IsLiteral<TKey extends string | number | symbol> = string extends TKey
  ? false
  : number extends TKey
    ? false
    : symbol extends TKey
      ? false
      : TKey extends Brand<string | number | symbol>
        ? false
        : true;

/**
 * Required keys type.
 */
type RequiredKeys<TObject extends Record<string | number | symbol, unknown>> = {
  [TKey in keyof TObject]: IsLiteral<TKey> extends true ? never : TKey;
}[keyof TObject];

/**
 * Optional keys type.
 */
type OptionalKeys<TObject extends Record<string | number | symbol, unknown>> = {
  [TKey in keyof TObject]: IsLiteral<TKey> extends true ? TKey : never;
}[keyof TObject];

/**
 * With question marks type.
 *
 * TODO: We need to document why we make entries optional when we detect that
 * the key is a literal type.
 *
 * Hint: We mark an entry as optional if we detect that its key is a literal
 * type. The reason for this is that it is not technically possible to detect
 * missing literal keys without restricting the key schema to `string`, `enum`
 * and `picklist`. However, if `enum` and `picklist` are used, it is better to
 * use `object` because it already covers the needed functionality. This
 * decision also reduces the bundle size of `record`, because it only needs to
 * check the entries of the input and not any missing keys.
 */
type WithQuestionMarks<
  TObject extends Record<string | number | symbol, unknown>,
> = ResolveObject<
  Pick<TObject, RequiredKeys<TObject>> &
    Partial<Pick<TObject, OptionalKeys<TObject>>>
>;

/**
 * Infer record input type.
 */
export type InferRecordInput<
  TKey extends BaseSchema<string, string | number | symbol, BaseIssue<unknown>>,
  TValue extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = WithQuestionMarks<Record<InferInput<TKey>, InferInput<TValue>>>;

/**
 * Infer record output type.
 */
export type InferRecordOutput<
  TKey extends BaseSchema<string, string | number | symbol, BaseIssue<unknown>>,
  TValue extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = WithQuestionMarks<Record<InferOutput<TKey>, InferOutput<TValue>>>;
