/* eslint-disable @typescript-eslint/no-explicit-any */
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
  TItem extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseValidation<any, unknown, BaseIssue<unknown>>
    | BaseValidationAsync<any, unknown, BaseIssue<unknown>>
    | BaseTransformation<any, unknown, BaseIssue<unknown>>
    | BaseTransformationAsync<any, unknown, BaseIssue<unknown>>
    | BaseMetadata<any>,
> = NonNullable<TItem['~types']>['input'];

/**
 * Infer output type.
 */
export type InferOutput<
  TItem extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseValidation<any, unknown, BaseIssue<unknown>>
    | BaseValidationAsync<any, unknown, BaseIssue<unknown>>
    | BaseTransformation<any, unknown, BaseIssue<unknown>>
    | BaseTransformationAsync<any, unknown, BaseIssue<unknown>>
    | BaseMetadata<any>,
> = NonNullable<TItem['~types']>['output'];

/**
 * Infer issue type.
 */
export type InferIssue<
  TItem extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
    | BaseValidation<any, unknown, BaseIssue<unknown>>
    | BaseValidationAsync<any, unknown, BaseIssue<unknown>>
    | BaseTransformation<any, unknown, BaseIssue<unknown>>
    | BaseTransformationAsync<any, unknown, BaseIssue<unknown>>
    | BaseMetadata<any>,
> = NonNullable<TItem['~types']>['issue'];
