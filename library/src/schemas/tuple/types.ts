import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types.ts';
import type { TupleItems } from './tuple.ts';
import type { TupleItemsAsync } from './tupleAsync.ts';

/**
 * Tuple path item type.
 */
export type TuplePathItem = {
  type: 'tuple';
  input: [any, ...any[]];
  key: number;
  value: any;
};

/**
 * Tuple input inference type.
 */
export type TupleInput<
  TItems extends TupleItems | TupleItemsAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined
> = TRest extends BaseSchema | BaseSchemaAsync
  ? [
      ...{
        [TKey in keyof TItems]: Input<TItems[TKey]>;
      },
      ...Input<TRest>[]
    ]
  : {
      [TKey in keyof TItems]: Input<TItems[TKey]>;
    };

/**
 * Tuple with rest output inference type.
 */
export type TupleOutput<
  TItems extends TupleItems | TupleItemsAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined
> = TRest extends BaseSchema | BaseSchemaAsync
  ? [
      ...{
        [TKey in keyof TItems]: Output<TItems[TKey]>;
      },
      ...Output<TRest>[]
    ]
  : {
      [TKey in keyof TItems]: Output<TItems[TKey]>;
    };
