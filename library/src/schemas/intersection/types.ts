import type { BaseSchema, BaseSchemaAsync } from '../../types.ts';
import type { IntersectionOptions } from './intersection.ts';
import type { IntersectionOptionsAsync } from './intersectionAsync.ts';

/**
 * Intersection input type.
 */
export type IntersectionInput<
  TIntersectionOptions extends IntersectionOptions | IntersectionOptionsAsync
> = TIntersectionOptions extends [
  BaseSchema<infer TInput1, any> | BaseSchemaAsync<infer TInput1, any>,
  ...infer TRest
]
  ? TRest extends IntersectionOptions
    ? TInput1 & IntersectionOutput<TRest>
    : TRest extends [
        BaseSchema<infer TInput2, any> | BaseSchemaAsync<infer TInput2, any>
      ]
    ? TInput1 & TInput2
    : never
  : never;

/**
 * Intersection output type.
 */
export type IntersectionOutput<
  TIntersectionOptions extends IntersectionOptions | IntersectionOptionsAsync
> = TIntersectionOptions extends [
  BaseSchema<any, infer TOutput1> | BaseSchemaAsync<any, infer TOutput1>,
  ...infer TRest
]
  ? TRest extends IntersectionOptions
    ? TOutput1 & IntersectionOutput<TRest>
    : TRest extends [
        BaseSchema<any, infer TOutput2> | BaseSchemaAsync<any, infer TOutput2>
      ]
    ? TOutput1 & TOutput2
    : never
  : never;
