import type { MaybePromise, MaybeReadonly } from '../types';

/**
 * Array input type.
 */
export type ArrayInput = MaybeReadonly<unknown[]>;

/**
 * Array requirement type.
 */
export type ArrayRequirement<TInput extends ArrayInput> = (
  item: TInput[number],
  index: number,
  array: TInput
) => boolean;

/**
 * Array requirement async type.
 */
export type ArrayRequirementAsync<TInput extends ArrayInput> = (
  ...params: Parameters<ArrayRequirement<TInput>>
) => MaybePromise<ReturnType<ArrayRequirement<TInput>>>;

/**
 * Content input type.
 */
export type ContentInput = string | MaybeReadonly<unknown[]>;

/**
 * Content requirement type.
 */
export type ContentRequirement<TInput extends ContentInput> =
  TInput extends readonly unknown[] ? TInput[number] : TInput;

/**
 * Length input type.
 */
export type LengthInput = string | ArrayLike<unknown>;

/**
 * Size input type.
 */
export type SizeInput = Blob | Map<unknown, unknown> | Set<unknown>;

/**
 * Value input type.
 */
export type ValueInput = string | number | bigint | boolean | Date;
