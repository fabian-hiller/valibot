import { describe, expect, it } from 'vitest';
import { ValibotGenerator } from '../lib/parser-and-generator';
import { getFileContents } from './utils/get-file-contents';

describe('should generate valibot schemas from OpenAPI json declaration file', () => {
  it('should parse small declaration file', async () => {
    const schema = await getFileContents(
      'spec/fixtures/input/small-schema.json'
    );
    const smallSchema = await getFileContents(
      'spec/fixtures/output/small-schema.ts'
    );
    const parser = new ValibotGenerator(schema, 'openapi-json');
    const parsed = parser.generate();
    expect(parsed.split('\n')).toEqual(smallSchema.split('\n'));
  });

  it('should parse complicated declaration file', async () => {
    const schema = await getFileContents(
      'spec/fixtures/input/complicated-schema.json'
    );
    const complexSchema = await getFileContents(
      'spec/fixtures/output/complicated-schema.ts'
    );
    const parser = new ValibotGenerator(schema, 'openapi-json');
    const parsed = parser.generate();
    expect(parsed.split('\n')).toEqual(complexSchema.split('\n'));
  });
});
