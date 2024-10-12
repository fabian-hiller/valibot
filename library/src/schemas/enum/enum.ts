import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue, _joinExpects, _stringify } from '../../utils/index.ts';

/**
 * Enum type.
 */
export interface Enum {
  [key: string]: string | number;
}

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
> extends BaseSchema<TEnum[keyof TEnum], TEnum[keyof TEnum], EnumIssue> {
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
  readonly options: TEnum[keyof TEnum][];
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

export function enum_(
  enum__: Enum,
  message?: ErrorMessage<EnumIssue>
): EnumSchema<Enum, ErrorMessage<EnumIssue> | undefined> {
  const options = Object.entries(enum__)
    .filter(([key]) => isNaN(+key))
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
    '~standard': 1,
    '~vendor': 'valibot',
    '~validate'(dataset, config = getGlobalConfig()) {
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
