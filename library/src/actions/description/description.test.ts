import { describe, expect, test } from 'vitest';
import { description, type DescriptionAction } from './description.ts';

describe('description', () => {
  test('should return action object', () => {
    expect(description<string, 'text'>('text')).toStrictEqual({
      kind: 'metadata',
      type: 'description',
      reference: description,
      description: 'text',
    } satisfies DescriptionAction<string, 'text'>);
  });
});
