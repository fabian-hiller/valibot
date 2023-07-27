import type { Input, Output } from '../../types.ts';
import type { ObjectShape } from './object.ts';
import type { ObjectShapesAsync } from './objectAsync.ts';

/**
 * Object path item type.
 */
export type ObjectPathItem = {
  schema: 'object';
  input: Record<string, any>;
  key: string;
  value: any;
};

/**
 * Object input inference type.
 */
export type ObjectInput<TObjectShape extends ObjectShape | ObjectShapesAsync> =
  {
    [TKey in keyof TObjectShape]: Input<TObjectShape[TKey]>;
  };

/**
 * Object output inference type.
 */
export type ObjectOutput<TObjectShape extends ObjectShape | ObjectShapesAsync> =
  {
    [TKey in keyof TObjectShape]: Output<TObjectShape[TKey]>;
  };
