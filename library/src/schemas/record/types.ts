import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types.ts';
import type { RecordKey } from './record.ts';
import type { RecordKeyAsync } from './recordAsync.ts';

/**
 * Record path item type.
 */
export type RecordPathItem = {
  schema: 'record';
  input: Record<string | number | symbol, any>;
  key: string | number | symbol;
  value: any;
};

/**
 * Record input inference type.
 */
export type RecordInput<
  TRecordKey extends RecordKey | RecordKeyAsync,
  TRecordValue extends BaseSchema | BaseSchemaAsync
> = Record<Input<TRecordKey>, Input<TRecordValue>>;

/**
 * Record output inference type.
 */
export type RecordOutput<
  TRecordKey extends RecordKey | RecordKeyAsync,
  TRecordValue extends BaseSchema | BaseSchemaAsync
> = Record<Output<TRecordKey>, Output<TRecordValue>>;
