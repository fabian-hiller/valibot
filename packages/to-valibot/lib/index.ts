import { writeFile } from 'node:fs/promises';
import { ValibotGenerator } from './parser-and-generator.ts';
import { slugify } from './utils/basic.ts';

interface GeneratorOptions {
  outDir: string;
}

type GenerateOptions =
  | { format: 'openapi-json' | 'json'; schema: object }
  | { format: 'openapi-json' | 'json'; schemas: object[] }
  | { format: 'openapi-json' | 'json' | 'openapi-yaml'; schema: string }
  | { format: 'openapi-json' | 'json' | 'openapi-yaml'; schemas: string[] };

const valibotGenerator = (options: GeneratorOptions) => {
  const generate = async (opt: GenerateOptions) => {
    if ('schemas' in opt) {
      for (const schema of opt.schemas) {
        const schemaCode =
          typeof schema === 'string'
            ? new ValibotGenerator(schema, opt.format)
            : new ValibotGenerator(
                schema,
                opt.format as 'openapi-json' | 'json'
              );

        const code = schemaCode.generate();
        const name = slugify(schemaCode.title);
        console.log(code, name, `${options.outDir}/${name}.ts`);
        await writeFile(`${options.outDir}/${name}.ts`, code);
      }
    } else {
      const schemaCode =
        typeof opt.schema === 'string'
          ? new ValibotGenerator(opt.schema, opt.format)
          : new ValibotGenerator(
              opt.schema,
              opt.format as 'openapi-json' | 'json'
            );

      const code = schemaCode.generate();
      const name = slugify(schemaCode.title);
      await writeFile(`${options.outDir}/${name}.ts`, code);
    }
  };

  return { generate };
};

export { valibotGenerator };
