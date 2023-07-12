import type { BaseSchema, BaseSchemaAsync, Input, Output } from '../../types';
import type { TupleShape } from './tuple';
import type { TupleShapeAsync } from './tupleAsync';

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
  TTupleItems extends TupleShape | TupleShapeAsync,
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
  TTupleItems extends TupleShape | TupleShapeAsync,
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
