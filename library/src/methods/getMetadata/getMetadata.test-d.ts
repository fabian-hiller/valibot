import { describe, expectTypeOf, test } from 'vitest';
import * as v from '../../index.ts';

describe('getMetadata', () => {
  test('should return metadata object (sync)', () => {
    const schema = v.pipe(
      v.string(),
      v.title('title'),
      v.email(),
      v.description('description'),
      v.metadata({ key: 'value' })
    );
    expectTypeOf(v.getMetadata(schema)).toEqualTypeOf<{
      readonly title: 'title';
      readonly description: 'description';
      readonly key: 'value';
    }>();
  });
  test('should return metadata object (async)', () => {
    const schema = v.pipeAsync(
      v.string(),
      v.title('title'),
      v.email(),
      v.description('description'),
      v.metadata({ key: 'value' })
    );
    expectTypeOf(v.getMetadata(schema)).toEqualTypeOf<{
      readonly title: 'title';
      readonly description: 'description';
      readonly key: 'value';
    }>();
  });
});
