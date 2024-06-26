import type {
  BaseIssue,
  BaseSchema,
  Dataset,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Date issue type.
 */
export interface DateIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'date';
  /**
   * The expected property.
   */
  readonly expected: 'Date';
}

/**
 * Date schema type.
 */
export interface DateSchema<
  TMessage extends ErrorMessage<DateIssue> | undefined,
> extends BaseSchema<Date, Date, DateIssue> {
  /**
   * The schema type.
   */
  readonly type: 'date';
  /**
   * The schema reference.
   */
  readonly reference: typeof date;
  /**
   * The expected property.
   */
  readonly expects: 'Date';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a date schema.
 *
 * @returns A date schema.
 */
export function date(): DateSchema<undefined>;

/**
 * Creates a date schema.
 *
 * @param message The error message.
 *
 * @returns A date schema.
 */
export function date<
  const TMessage extends ErrorMessage<DateIssue> | undefined,
>(message: TMessage): DateSchema<TMessage>;

export function date(
  message?: ErrorMessage<DateIssue>
): DateSchema<ErrorMessage<DateIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'date',
    reference: date,
    expects: 'Date',
    async: false,
    message,
    _run(dataset, config) {
      if (dataset.value instanceof Date) {
        // @ts-expect-error
        if (!isNaN(dataset.value)) {
          dataset.typed = true;
        } else {
          _addIssue(this, 'type', dataset, config, {
            received: '"Invalid Date"',
          });
        }
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      return dataset as Dataset<Date, DateIssue>;
    },
  };
}
