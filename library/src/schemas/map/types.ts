import type { BaseSchema, BaseSchemaAsync, Input, Output } from '../../types';

/**
 * Map path item type.
 */
export type MapPathItem = {
  schema: 'map';
  input: Map<any, any>;
  key: any;
  value: any;
};

/**
 * Map input inference type.
 */
export type MapInput<
  TMapKey extends BaseSchema | BaseSchemaAsync,
  TMapValue extends BaseSchema | BaseSchemaAsync
> = Map<Input<TMapKey>, Input<TMapValue>>;

/**
 * Map output inference type.
 */
export type MapOutput<
  TMapKey extends BaseSchema | BaseSchemaAsync,
  TMapValue extends BaseSchema | BaseSchemaAsync
> = Map<Output<TMapKey>, Output<TMapValue>>;
