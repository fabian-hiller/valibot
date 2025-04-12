import { describe, expect, test } from 'vitest';
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
    expect(v.getMetadata(schema)).toStrictEqual({
      title: 'title',
      description: 'description',
      key: 'value',
    });
  });
  test('should return metadata object (async)', () => {
    const schema = v.pipeAsync(
      v.string(),
      v.title('title'),
      v.email(),
      v.description('description'),
      v.metadata({ key: 'value' })
    );
    expect(v.getMetadata(schema)).toStrictEqual({
      title: 'title',
      description: 'description',
      key: 'value',
    });
  });
});
