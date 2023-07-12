import type { ObjectSchema, ObjectSchemaAsync } from '../../schemas';

/**
 * Object keys type.
 */
export type ObjectKeys<
  TObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>
> = [keyof TObjectSchema['object'], ...(keyof TObjectSchema['object'])[]];
