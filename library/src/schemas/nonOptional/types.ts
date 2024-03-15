import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types/index.ts';

/**
 * Non optional type.
 */
type NonOptional<T> = T extends undefined ? never : T;

/**
 * Non optional input inference type.
 */
export type NonOptionalInput<TWrapped extends BaseSchema | BaseSchemaAsync> =
  NonOptional<Input<TWrapped>>;

/**
 * Non optional output inference type.
 */
export type NonOptionalOutput<TWrapped extends BaseSchema | BaseSchemaAsync> =
  NonOptional<Output<TWrapped>>;
