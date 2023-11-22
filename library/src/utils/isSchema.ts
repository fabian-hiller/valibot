import type { BaseSchema, BaseSchemaAsync } from '../types/schema.ts';
import { isNonNullable } from './isNonNullable.ts';

export const isSchema = (val: unknown): val is BaseSchema | BaseSchemaAsync =>
  isNonNullable(val) &&
  typeof val === `object` &&
  'type' in val &&
  typeof val.type === `string` &&
  'async' in val &&
  typeof val.async === `boolean` &&
  '_parse' in val &&
  typeof val._parse === `function`;
