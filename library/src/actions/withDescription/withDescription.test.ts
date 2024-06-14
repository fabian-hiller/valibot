import { describe, expect, test } from 'vitest';
import { pipe } from '../../methods/index.ts';
import { string } from '../../schemas/index.ts';
import {
  withDescription,
  type WithDescriptionMetadata,
} from './withDescription.ts';

describe('withDescription', () => {
  test('should return metadata object', () => {
    const metadata: WithDescriptionMetadata<unknown, 'test'> = {
      kind: 'metadata',
      type: 'with_description',
      reference: withDescription,
      extraProperties: {
        description: 'test' as const,
      },
    };

    expect(withDescription('test')).toStrictEqual(metadata);
  });

  test('should work in pipe', () => {
    const schema = pipe(string(), withDescription('some description'));
    expect(schema.description).toEqual('some description');
  });
});
