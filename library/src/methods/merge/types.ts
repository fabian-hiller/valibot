import type { ObjectSchema, ObjectSchemaAsync } from '../../schemas/index.ts';

/**
 * Merges objects types.
 */
export type MergeObjects<
  TSchemas extends (ObjectSchema<any, any> | ObjectSchemaAsync<any, any>)[]
> = TSchemas extends [
  infer TFirstSchema extends
    | ObjectSchema<any, any>
    | ObjectSchemaAsync<any, any>
]
  ? TFirstSchema['entries']
  : TSchemas extends [
      infer TFirstSchema extends
        | ObjectSchema<any, any>
        | ObjectSchemaAsync<any, any>,
      ...infer TRestSchemas
    ]
  ? MergeObjectsInner<TRestSchemas, TFirstSchema['entries']>
  : never;

type MergeObjectsInner<TSchemas, Result> = TSchemas extends [
  infer TFirstSchema extends
    | ObjectSchema<any, any>
    | ObjectSchemaAsync<any, any>
]
  ? TFirstSchema['entries']
  : TSchemas extends [
      infer TFirstSchema extends
        | ObjectSchema<any, any>
        | ObjectSchemaAsync<any, any>,
      ...infer TRestSchemas
    ]
  ? MergeObjectsInner<
      TRestSchemas,
      {
        [K in
          | keyof Result
          | keyof TFirstSchema['entries']]: K extends keyof TFirstSchema['entries']
          ? TFirstSchema['entries'][K]
          : Result[K];
      }
    >
  : never;
