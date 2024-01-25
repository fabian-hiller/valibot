import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types/index.ts';

/**
 * Non nullish type.
 */
type NonNullish<T> = T extends null | undefined ? never : T;

/**
 * Non nullish input inference type.
 */
export type NonNullishInput<TWrapped extends BaseSchema | BaseSchemaAsync> =
  NonNullish<Input<TWrapped>>;

/**
 * Non nullish output inference type.
 */
export type NonNullishOutput<TWrapped extends BaseSchema | BaseSchemaAsync> =
  NonNullish<Output<TWrapped>>;
