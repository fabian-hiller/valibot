import { ObjectInput, ObjectOutput, ObjectShape, ObjectShapesAsync } from "../object";

/**
 * Passthrough type.
 */
export type Passthrough<T> = T & Record<string, unknown>;

/**
 * Passthrough input inference type.
 */
export type PassthroughInput<TObjectShape extends ObjectShape | ObjectShapesAsync> = Passthrough<ObjectInput<TObjectShape>>;

/**
 * Passthrough input inference type.
 */
export type PassthroughOutput<TObjectShape extends ObjectShape | ObjectShapesAsync> = Passthrough<ObjectOutput<TObjectShape>>;
