import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types/index';

/**
 * Non nullable type.
 */
type NonNullable<T> = T extends null ? never : T;

/**
 * Non nullable input inference type.
 */
export type NonNullableInput<TWrapped extends BaseSchema | BaseSchemaAsync> =
  NonNullable<Input<TWrapped>>;

/**
 * Non nullable output inference type.
 */
export type NonNullableOutput<TWrapped extends BaseSchema | BaseSchemaAsync> =
  NonNullable<Output<TWrapped>>;
