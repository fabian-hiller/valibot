import type { MaybeReadonly } from '../../types/index.ts';

/**
 * Picklist options type.
 */
export type PicklistOptions<TOption extends string = string> = MaybeReadonly<
  TOption[]
>;
