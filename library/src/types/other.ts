import type { ObjectSchema, ObjectSchemaAsync } from '../schemas/index.ts';

/**
 * Object keys type.
 */
export type ObjectKeys<
  TSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>,
> = MaybeReadonly<[keyof TSchema['entries'], ...(keyof TSchema['entries'])[]]>;

/**
 * Maybe readonly type.
 */
export type MaybeReadonly<T> = T | Readonly<T>;

/**
 * Maybe promise type.
 *
 * TODO: Refactor library with this type.
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Resolve type.
 *
 * Hint: This type has no effect and is only used so that TypeScript displays
 * the final type in the preview instead of the utility types used.
 */
type Resolve<T> = T;

/**
 * Resolve object type.
 *
 * Hint: This type has no effect and is only used so that TypeScript displays
 * the final type in the preview instead of the utility types used.
 */
export type ResolveObject<T> = Resolve<{ [k in keyof T]: T[k] }>;
