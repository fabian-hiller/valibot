import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types/index.ts';

/**
 * Map path item type.
 */
export type MapPathItem = {
  type: 'map';
  origin: 'key' | 'value';
  input: Map<unknown, unknown>;
  key: unknown;
  value: unknown;
};

/**
 * Map input inference type.
 */
export type MapInput<
  TKey extends BaseSchema | BaseSchemaAsync,
  TValue extends BaseSchema | BaseSchemaAsync,
> = Map<Input<TKey>, Input<TValue>>;

/**
 * Map output inference type.
 */
export type MapOutput<
  TKey extends BaseSchema | BaseSchemaAsync,
  TValue extends BaseSchema | BaseSchemaAsync,
> = Map<Output<TKey>, Output<TValue>>;
