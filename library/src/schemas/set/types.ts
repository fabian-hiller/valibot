import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types/index.ts';

/**
 * Set path item type.
 */
export type SetPathItem = {
  type: 'set';
  origin: 'value';
  input: Set<unknown>;
  key: number;
  value: unknown;
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
