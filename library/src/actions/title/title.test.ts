import { describe, expect, test } from 'vitest';
import { title, type TitleAction } from './title.ts';

describe('title', () => {
  test('should return action object', () => {
    expect(title<string, 'text'>('text')).toStrictEqual({
      kind: 'metadata',
      type: 'title',
      reference: title,
      title: 'text',
    } satisfies TitleAction<string, 'text'>);
  });
});
