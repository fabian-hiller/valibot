import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types.ts';

/**
 * Map path item type.
 */
export type MapPathItem = {
  type: 'map';
  input: Map<any, any>;
  key: any;
  value: any;
};

/**
 * Map input inference type.
 */
export type MapInput<
  TKey extends BaseSchema | BaseSchemaAsync,
  TValue extends BaseSchema | BaseSchemaAsync
> = Map<Input<TKey>, Input<TValue>>;

/**
 * Map output inference type.
 */
export type MapOutput<
  TKey extends BaseSchema | BaseSchemaAsync,
  TValue extends BaseSchema | BaseSchemaAsync
> = Map<Output<TKey>, Output<TValue>>;
