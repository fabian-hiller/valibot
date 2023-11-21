import type { BaseSchema, BaseSchemaAsync, Output } from '../../types/index.ts';

/**
 * Schema with maybe default type.
 */
export interface SchemaWithMaybeDefault<TInput = any, TOutput = TInput>
  extends BaseSchema<TInput, TOutput> {
  /**
   * The optional default value.
   */
  default?: TOutput | (() => TOutput | undefined);
}

/**
 * Schema with maybe default async type.
 */
export interface SchemaWithMaybeDefaultAsync<TInput = any, TOutput = TInput>
  extends BaseSchemaAsync<TInput, TOutput> {
  /**
   * The optional default value.
   */
  default?:
    | TOutput
    | (() => TOutput | Promise<TOutput | undefined> | undefined);
}

/**
 * Default value type.
 */
export type DefaultValue<
  TSchema extends SchemaWithMaybeDefault | SchemaWithMaybeDefaultAsync
> = TSchema['default'] extends Output<TSchema> | undefined
  ? TSchema['default']
  : TSchema['default'] extends () => Output<TSchema> | undefined
  ? ReturnType<TSchema['default']>
  : TSchema['default'] extends () => Promise<Output<TSchema> | undefined>
  ? Awaited<ReturnType<TSchema['default']>>
  : undefined;
