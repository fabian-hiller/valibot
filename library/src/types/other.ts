import type { InferInput } from './infer.ts';
import type { BaseIssue } from './issue.ts';
import type { BaseSchema, BaseSchemaAsync } from './schema.ts';
import type { MaybePromise } from './utils.ts';

/**
 * Error message type.
 */
export type ErrorMessage<TIssue extends BaseIssue<unknown>> =
  | ((issue: TIssue) => string)
  | string;

/**
 * Function reference type.
 */
export type FunctionReference<TArgs extends unknown[], TReturn> = (
  ...args: TArgs
) => TReturn;

/**
 * Default type.
 */
export type Default<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
> = InferInput<TSchema> | (() => InferInput<TSchema> | undefined) | undefined;

/**
 * Default async type.
 */
export type DefaultAsync<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> =
  | InferInput<TSchema>
  | (() => MaybePromise<InferInput<TSchema> | undefined>)
  | undefined;
