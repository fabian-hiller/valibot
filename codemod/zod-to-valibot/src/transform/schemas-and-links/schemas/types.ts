// FIXME: Import seems to be broken
import type { getSchemaOptionVal } from '../schemas-and-properties';

type SchemaOptionASTVal = ReturnType<typeof getSchemaOptionVal>;

export type SchemaOptionsToASTVal = Partial<
  Record<
    'invalid_type_error' | 'required_error' | 'message' | 'description',
    SchemaOptionASTVal
  >
>;
