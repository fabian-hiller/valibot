import type { BaseSchema, BaseSchemaAsync, Input, Output } from '../../types';

/**
 * Set path item type.
 */
export type SetPathItem = {
  schema: 'set';
  input: Set<any>;
  key: number;
  value: any;
};

/**
 * Set output inference type.
 */
export type SetInput<TSetValue extends BaseSchema | BaseSchemaAsync> = Set<
  Input<TSetValue>
>;

/**
 * Set output inference type.
 */
export type SetOutput<TSetValue extends BaseSchema | BaseSchemaAsync> = Set<
  Output<TSetValue>
>;
