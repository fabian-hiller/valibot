import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types.ts';

/**
 * Set path item type.
 */
export type SetPathItem = {
  type: 'set';
  input: Set<any>;
  key: number;
  value: any;
};

/**
 * Set output inference type.
 */
export type SetInput<TValue extends BaseSchema | BaseSchemaAsync> = Set<
  Input<TValue>
>;

/**
 * Set output inference type.
 */
export type SetOutput<TValue extends BaseSchema | BaseSchemaAsync> = Set<
  Output<TValue>
>;
