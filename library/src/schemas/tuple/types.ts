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
  schema: 'tuple';
  input: [any, ...any[]];
  key: number;
  value: any;
};

/**
 * Tuple input inference type.
 */
export type TupleInput<
  TTupleItems extends TupleItems | TupleItemsAsync,
  TTupleRest extends BaseSchema | BaseSchemaAsync | undefined
> = TTupleRest extends BaseSchema | BaseSchemaAsync
  ? [
      ...{
        [TKey in keyof TTupleItems]: Input<TTupleItems[TKey]>;
      },
      ...Input<TTupleRest>[]
    ]
  : {
      [TKey in keyof TTupleItems]: Input<TTupleItems[TKey]>;
    };

/**
 * Tuple with rest output inference type.
 */
export type TupleOutput<
  TTupleItems extends TupleItems | TupleItemsAsync,
  TTupleRest extends BaseSchema | BaseSchemaAsync | undefined
> = TTupleRest extends BaseSchema | BaseSchemaAsync
  ? [
      ...{
        [TKey in keyof TTupleItems]: Output<TTupleItems[TKey]>;
      },
      ...Output<TTupleRest>[]
    ]
  : {
      [TKey in keyof TTupleItems]: Output<TTupleItems[TKey]>;
    };
