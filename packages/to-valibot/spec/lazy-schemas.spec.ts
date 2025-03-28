import { describe, expect, it } from 'vitest';
import { ValibotGenerator } from '../lib/parser-and-generator';
import { getFileContents } from './utils/get-file-contents';

describe('should generate valibot schemas from self referencing and circular schemas', () => {
  it('should parse JSON Schema with circular references', async () => {
    const schema = await getFileContents(
      'spec/fixtures/input/circular-refs-schema.json'
    );
    const noRefsSchemaOutput = await getFileContents(
      'spec/fixtures/output/circular-refs-schema.ts'
    );

    const parser = new ValibotGenerator(schema, 'json');
    const parsed = parser.generate();
    expect(parsed.split('\n')).toEqual(noRefsSchemaOutput.split('\n'));
  });

  it('should parse self referencing JSON Schema', async () => {
    const schema = await getFileContents(
      'spec/fixtures/input/self-ref-schema.json'
    );
    const mediumRefsSchemaOutput = await getFileContents(
      'spec/fixtures/output/self-ref-schema.ts'
    );
    const parser = new ValibotGenerator(schema, 'json');
    const parsed = parser.generate();
    expect(parsed.split('\n')).toEqual(mediumRefsSchemaOutput.split('\n'));
  });
});
