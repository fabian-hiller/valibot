import type { BaseIssue } from './issue.ts';
import type { BaseMetadata } from './metadata.ts';
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
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseValidation<unknown, unknown, BaseIssue<unknown>>
    | BaseValidationAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseTransformation<unknown, unknown, BaseIssue<unknown>>
    | BaseTransformationAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseMetadata<unknown>,
> = NonNullable<TSchema['_types']>['input'];

/**
 * Infer output type.
 */
export type InferOutput<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseValidation<unknown, unknown, BaseIssue<unknown>>
    | BaseValidationAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseTransformation<unknown, unknown, BaseIssue<unknown>>
    | BaseTransformationAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseMetadata<unknown>,
> = NonNullable<TSchema['_types']>['output'];

/**
 * Infer issue type.
 */
export type InferIssue<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseValidation<unknown, unknown, BaseIssue<unknown>>
    | BaseValidationAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseTransformation<unknown, unknown, BaseIssue<unknown>>
    | BaseTransformationAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseMetadata<unknown>,
> = NonNullable<TSchema['_types']>['issue'];
