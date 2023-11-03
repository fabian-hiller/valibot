import type { BaseSchema, BaseSchemaAsync } from '../../types.ts';
import type { IntersectOptions } from './intersect.ts';
import type { IntersectOptionsAsync } from './intersectAsync.ts';

/**
 * Intersect input type.
 */
export type IntersectInput<
  TIntersectOptions extends IntersectOptions | IntersectOptionsAsync
> = TIntersectOptions extends [
  BaseSchema<infer TInput1, any> | BaseSchemaAsync<infer TInput1, any>,
  ...infer TRest
]
  ? TRest extends IntersectOptions
    ? TInput1 & IntersectOutput<TRest>
    : TRest extends [
        BaseSchema<infer TInput2, any> | BaseSchemaAsync<infer TInput2, any>
      ]
    ? TInput1 & TInput2
    : never
  : never;

/**
 * Intersect output type.
 */
export type IntersectOutput<
  TIntersectOptions extends IntersectOptions | IntersectOptionsAsync
> = TIntersectOptions extends [
  BaseSchema<any, infer TOutput1> | BaseSchemaAsync<any, infer TOutput1>,
  ...infer TRest
]
  ? TRest extends IntersectOptions
    ? TOutput1 & IntersectOutput<TRest>
    : TRest extends [
        BaseSchema<any, infer TOutput2> | BaseSchemaAsync<any, infer TOutput2>
      ]
    ? TOutput1 & TOutput2
    : never
  : never;
