import type { BaseSchema, Input, Output } from '../../types/index.ts';

/**
 * Recursive schema type.
 */
export interface RecursiveSchema<
  TGetter extends () => BaseSchema,
  TOutput = Output<ReturnType<TGetter>>
> extends BaseSchema<Input<ReturnType<TGetter>>, TOutput> {
  /**
   * The schema type.
   */
  type: 'recursive';
  /**
   * The schema getter.
   */
  getter: TGetter;
}

/**
 * Creates a recursive schema.
 *
 * @param getter The schema getter.
 *
 * @returns A recursive schema.
 */
export function recursive<TGetter extends () => BaseSchema>(
  getter: TGetter
): RecursiveSchema<TGetter> {
  return {
    type: 'recursive',
    async: false,
    getter,
    _parse(input, info) {
      return this.getter()._parse(input, info);
    },
  };
}
