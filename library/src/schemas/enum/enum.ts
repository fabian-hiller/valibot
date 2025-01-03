import type {
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import {
  _addIssue,
  _getStandardProps,
  _joinExpects,
  _stringify,
} from '../../utils/index.ts';

/**
 * Enum type.
 */
export interface Enum {
  [key: string]: string | number;
}

/**
 * Checks if a string can be produced by Number.prototype.toString with radix=10.
 */
type IsNumericString<K extends string> = K extends
  | 'NaN'
  | 'Infinity'
  | '-Infinity'
  ? true
  : K extends `${infer V extends number}`
    ? `${V}` extends K
      ? true
      : false
    : false;

type OmitReverseMappingValue<
  K extends string | number,
  V,
  Ks extends string | number,
> = K extends number
  ? number extends K
    ? never
    : Exclude<V, Ks>
  : K extends string
    ? IsNumericString<K> extends true
      ? Exclude<V, Ks>
      : V
    : never;

/**
 * enum_ only accepts enum values of string & non-numeric keys that has its reverse mapping.
 * This type-level function filters out numeric keys including Infinity and NaN.
 *
 * @example EnumValues<{ 1: NaN; NaN: 1; 2: 'foo' }> = NaN | 'foo'
 */
type EnumValues<TEnum extends Enum> = {
  [K in (string | number) & keyof TEnum]: OmitReverseMappingValue<
    K,
    TEnum[K],
    (string | number) & keyof TEnum
  >;
}[(string | number) & keyof TEnum];

/**
 * Enum issue type.
 */
export interface EnumIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'enum';
  /**
   * The expected property.
   */
  readonly expected: string;
}

/**
 * Enum schema type.
 */
export interface EnumSchema<
  TEnum extends Enum,
  TMessage extends ErrorMessage<EnumIssue> | undefined,
> extends BaseSchema<EnumValues<TEnum>, EnumValues<TEnum>, EnumIssue> {
  /**
   * The schema type.
   */
  readonly type: 'enum';
  /**
   * The schema reference.
   */
  readonly reference: typeof enum_;
  /**
   * The enum object.
   */
  readonly enum: TEnum;
  /**
   * The enum options.
   */
  readonly options: EnumValues<TEnum>[];
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an enum schema.
 *
 * @param enum__ The enum object.
 *
 * @returns An enum schema.
 */
export function enum_<const TEnum extends Enum>(
  enum__: TEnum
): EnumSchema<TEnum, undefined>;

/**
 * Creates an enum schema.
 *
 * @param enum__ The enum object.
 * @param message The error message.
 *
 * @returns An enum schema.
 */
export function enum_<
  const TEnum extends Enum,
  const TMessage extends ErrorMessage<EnumIssue> | undefined,
>(enum__: TEnum, message: TMessage): EnumSchema<TEnum, TMessage>;

// @__NO_SIDE_EFFECTS__
export function enum_(
  enum__: Enum,
  message?: ErrorMessage<EnumIssue>
): EnumSchema<Enum, ErrorMessage<EnumIssue> | undefined> {
  const options = Object.entries(enum__)
    .filter(
      ([key, value]) =>
        !(
          `${+key}` === key &&
          typeof value === 'string' &&
          Object.is(enum__[value], +key)
        )
    )
    .map(([, value]) => value);
  return {
    kind: 'schema',
    type: 'enum',
    reference: enum_,
    expects: _joinExpects(options.map(_stringify), '|'),
    async: false,
    enum: enum__,
    options,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      // @ts-expect-error
      if (this.options.includes(dataset.value)) {
        // @ts-expect-error
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      // @ts-expect-error
      return dataset as OutputDataset<string | number, EnumIssue>;
    },
  };
}

export { enum_ as enum };
