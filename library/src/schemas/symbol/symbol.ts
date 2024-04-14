import type { BaseIssue, BaseSchema, ErrorMessage } from '../../types/index.ts';
import { _schemaDataset } from '../../utils/index.ts';

/**
 * Symbol issue type.
 */
export interface SymbolIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'symbol';
  /**
   * The expected input.
   */
  readonly expected: 'symbol';
}

/**
 * Symbol schema type.
 */
export interface SymbolSchema<
  TMessage extends ErrorMessage<SymbolIssue> | undefined,
> extends BaseSchema<symbol, symbol, SymbolIssue> {
  /**
   * The schema type.
   */
  readonly type: 'symbol';
  /**
   * The expected property.
   */
  readonly expects: 'symbol';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a symbol schema.
 *
 * @returns A symbol schema.
 */
export function symbol(): SymbolSchema<undefined>;

/**
 * Creates a symbol schema.
 *
 * @param message The error message.
 *
 * @returns A symbol schema.
 */
export function symbol<
  const TMessage extends ErrorMessage<SymbolIssue> | undefined,
>(message: TMessage): SymbolSchema<TMessage>;

export function symbol(
  message?: ErrorMessage<SymbolIssue>
): SymbolSchema<ErrorMessage<SymbolIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'symbol',
    expects: 'symbol',
    async: false,
    message,
    _run(dataset, config) {
      return _schemaDataset(
        this,
        symbol,
        typeof dataset.value === 'symbol',
        dataset,
        config
      );
    },
  };
}
