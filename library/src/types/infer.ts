import type { BaseIssue } from './issue.ts';
import type { BaseSchema, BaseSchemaAsync } from './schema.ts';
import type {
  BaseTransformation,
  BaseTransformationAsync,
} from './transformation.ts';
import type { BaseValidation, BaseValidationAsync } from './validation.ts';

/**
 * Infer input type.
 */
export type InferInput<
  TItem extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseValidation<unknown, unknown, BaseIssue<unknown>>
    | BaseValidationAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseTransformation<unknown, unknown, BaseIssue<unknown>>
    | BaseTransformationAsync<unknown, unknown, BaseIssue<unknown>>,
> = NonNullable<TItem['_types']>['input'];

/**
 * Infer output type.
 */
export type InferOutput<
  TItem extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseValidation<unknown, unknown, BaseIssue<unknown>>
    | BaseValidationAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseTransformation<unknown, unknown, BaseIssue<unknown>>
    | BaseTransformationAsync<unknown, unknown, BaseIssue<unknown>>,
> = NonNullable<TItem['_types']>['output'];

/**
 * Infer issue type.
 */
export type InferIssue<
  TItem extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseValidation<unknown, unknown, BaseIssue<unknown>>
    | BaseValidationAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseTransformation<unknown, unknown, BaseIssue<unknown>>
    | BaseTransformationAsync<unknown, unknown, BaseIssue<unknown>>,
> = NonNullable<TItem['_types']>['issue'];
