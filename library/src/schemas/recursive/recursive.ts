import type {
  BaseSchema,
  Input,
  Output,
  SchemaMetadata,
} from '../../types/index.ts';

/**
 * Recursive schema type.
 */
export type RecursiveSchema<
  TGetter extends () => BaseSchema,
  TOutput = Output<ReturnType<TGetter>>
> = BaseSchema<Input<ReturnType<TGetter>>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'recursive';
  /**
   * The schema getter.
   */
  getter: TGetter;
};

/**
 * Creates a recursive schema.
 *
 * @param getter The schema getter.
 * @param metadata The schema metadata.
 *
 * @returns A recursive schema.
 */
export function recursive<TGetter extends () => BaseSchema>(
  getter: TGetter,
  metadata?: SchemaMetadata
): RecursiveSchema<TGetter> {
  return {
    type: 'recursive',
    expects: 'unknown',
    async: false,
    getter,
    get metadata() {
      return metadata ?? this.getter().metadata;
    },
    _parse(input, config) {
      return this.getter()._parse(input, config);
    },
  };
}
