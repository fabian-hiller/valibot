import type { BaseIssue, BaseSchema, ErrorMessage } from '../../types/index.ts';
import { _schemaDataset, _stringify } from '../../utils/index.ts';

/**
 * Enum type.
 */
export interface Enum {
  [key: string]: string | number;
  [key: number]: string;
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
   * The expected input.
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
   * The enum object.
   */
  readonly enum: TEnum;
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
  const values = Object.values(enum__);
  return {
    kind: 'schema',
    type: 'enum',
    expects: values.map(_stringify).join(' | '),
    async: false,
    enum: enum__,
    message,
    _run(dataset, config) {
      return _schemaDataset(
        this,
        enum_,
        // @ts-expect-error
        values.includes(dataset.value),
        dataset,
        config
      );
    },
  };
}
