import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types/index.ts';
import type { NeverSchema, NeverSchemaAsync } from '../never/index.ts';
import type { TupleItems } from './tuple.ts';
import type { TupleItemsAsync } from './tupleAsync.ts';

/**
 * Tuple path item type.
 */
export interface TuplePathItem {
  type: 'tuple';
  origin: 'value';
  input: [unknown, ...unknown[]];
  key: number;
  value: unknown;
}

/**
 * Tuple input inference type.
 */
export type TupleInput<
  TItems extends TupleItems | TupleItemsAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined,
> = TRest extends undefined | NeverSchema | NeverSchemaAsync
  ? {
      [TKey in keyof TItems]: Input<TItems[TKey]>;
    }
  : TRest extends BaseSchema | BaseSchemaAsync
    ? [
        ...{
          [TKey in keyof TItems]: Input<TItems[TKey]>;
        },
        ...Input<TRest>[],
      ]
    : never;

/**
 * Tuple with rest output inference type.
 */
export type TupleOutput<
  TItems extends TupleItems | TupleItemsAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined,
> = TRest extends undefined | NeverSchema | NeverSchemaAsync
  ? {
      [TKey in keyof TItems]: Output<TItems[TKey]>;
    }
  : TRest extends BaseSchema | BaseSchemaAsync
    ? [
        ...{
          [TKey in keyof TItems]: Output<TItems[TKey]>;
        },
        ...Output<TRest>[],
      ]
    : never;
