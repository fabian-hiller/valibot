import type { BaseIssue } from './issue.ts';
import type { BaseSchema, BaseSchemaAsync } from './schema.ts';
import type {
  BaseTransformation,
  BaseTransformationAsync,
} from './transformation.ts';
import type { BaseValidation, BaseValidationAsync } from './validation.ts';

/**
 * Pipe action type.
 */
export type PipeAction<TInput, TOutput, TIssue extends BaseIssue<unknown>> =
  | BaseValidation<TInput, TOutput, TIssue>
  | BaseTransformation<TInput, TOutput, TIssue>;

/**
 * Pipe action async type.
 */
export type PipeActionAsync<
  TInput,
  TOutput,
  TIssue extends BaseIssue<unknown>,
> =
  | PipeAction<TInput, TOutput, TIssue>
  | BaseValidationAsync<TInput, TOutput, TIssue>
  | BaseTransformationAsync<TInput, TOutput, TIssue>;

/**
 * Pipe item type.
 */
export type PipeItem<TInput, TOutput, TIssue extends BaseIssue<unknown>> =
  | BaseSchema<TInput, TOutput, TIssue>
  | PipeAction<TInput, TOutput, TIssue>;

/**
 * Pipe item async type.
 */
export type PipeItemAsync<TInput, TOutput, TIssue extends BaseIssue<unknown>> =
  | PipeItem<TInput, TOutput, TIssue>
  | BaseSchemaAsync<TInput, TOutput, TIssue>
  | PipeActionAsync<TInput, TOutput, TIssue>;

/**
 * No pipe type.
 */
export type NoPipe<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
> = TSchema & { pipe?: never };
