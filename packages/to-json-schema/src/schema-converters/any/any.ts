import type { AnySchema } from 'valibot';
import type { SchemaConverter } from '../types.ts';

export type SupportedAnySchema = AnySchema;

/**
 * Convert `any` schema.
 *
 * @returns the converted schema
 */
export const any: SchemaConverter<SupportedAnySchema> = () => ({});
