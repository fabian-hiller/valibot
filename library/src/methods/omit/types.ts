import type { ObjectSchema, ObjectSchemaAsync } from '../../schemas/index.ts';

/**
 * Object keys type.
 */
export type ObjectKeys<
  TObjectSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>
> = [
  keyof TObjectSchema['object']['entries'],
  ...(keyof TObjectSchema['object']['entries'])[]
];
