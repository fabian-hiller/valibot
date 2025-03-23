import {
  any,
  array,
  check,
  InferOutput,
  object,
  optional,
  parse,
  pipe,
  record,
  string,
} from 'valibot';
import { parse as parseYaml } from 'yaml';
import {
  actionDescription,
  actionEmail,
  actionIsoDateTime,
  actionMaxLength,
  actionMaxValue,
  actionMinLength,
  actionMinValue,
  actionMultipleOf,
  ActionNode,
  actionRegex,
  actionUniqueItems,
  actionUUID,
  AnyNode,
  methodPipe,
  schemaNodeArray,
  schemaNodeBoolean,
  schemaNodeLiteral,
  schemaNodeNull,
  schemaNodeNumber,
  schemaNodeObject,
  schemaNodeOptional,
  schemaNodeReference,
  schemaNodeString,
  schemaNodeUnion,
} from './schema-nodes.ts';
import type {
  JSONSchema,
  JSONSchemaArray,
  JSONSchemaBoolean,
  JSONSchemaNull,
  JSONSchemaNumber,
  JSONSchemaObject,
  JSONSchemaString,
} from './types.ts';
import { appendSchema, capitalize, normalizeTitle } from './utils/basic.ts';
import { findAndHandleCircularReferences } from './utils/circular-refs.ts';
import { topologicalSort } from './utils/topological-sort.ts';

const OpenAPISchema = object({
  info: object({
    title: string(),
  }),
  components: object({
    schemas: record(string(), any()),
  }),
});

const JSONSchemaSchema = object({
  $schema: string(),
  title: string(),
  type: string(),
  description: string(),
  definitions: optional(
    record(
      string(),
      pipe(
        any(),
        check<JSONSchema>(() => true)
      )
    )
  ),
  properties: pipe(
    any(),
    check<Record<string, JSONSchemaObject>>(() => true)
  ),
  required: optional(array(string())),
});
type JSONSchemaSchema = InferOutput<typeof JSONSchemaSchema>;

const customRules = {
  uniqueItems: {
    code: `const uniqueItems = <Type, Message extends string>(
  message?: Message
): CheckItemsAction<Type[], Message | undefined> =>
  checkItems((item, i, arr) => arr.indexOf(item) === i, message);`,
    imports: ['CheckItemsAction', 'checkItems'],
  },
} as const;
type CustomRules = keyof typeof customRules;

type AllowedImports = 
  | 'CheckItemsAction'
  | 'GenericSchema'
  | 'InferOutput'
  | 'array'
  | 'boolean'
  | 'check'
  | 'checkItems'
  | 'email'
  | 'lazy'
  | 'literal'
  | 'maxLength'
  | 'maxValue'
  | 'minLength'
  | 'minValue'
  | 'multipleOf'
  | 'null'
  | 'number'
  | 'object'
  | 'optional'
  | 'pipe'
  | 'regex'
  | 'string'
  | 'union'
  | 'uuid'
  | 'isoDateTime';

class ValibotGenerator {
  private root:
    | { format: 'json'; value: JSONSchemaSchema; title: string }
    | {
        format: 'openapi-json' | 'openapi-yaml';
        value: Record<string, JSONSchema>;
        title: string;
      };

  get title() {
    return this.root.title;
  }

  private refs = new Map<string, string>();
  private schemas: Record<string, AnyNode> = {};
  private dependsOn: Record<string, string[]> = {};
  private usedImports = new Set<AllowedImports>();
  private customRules = new Set<CustomRules>();

  private __currentSchema: string | null = null;

  constructor(
    content: string,
    format: 'openapi-json' | 'openapi-yaml' | 'json'
  );
  constructor(content: object, format: 'openapi-json' | 'json');
  constructor(content: any, format: 'openapi-json' | 'openapi-yaml' | 'json') {
    switch (format) {
      case 'openapi-json': {
        const parsed = parse(
          OpenAPISchema,
          typeof content === 'string' ? JSON.parse(content) : content
        );
        this.root = {
          value: parsed.components.schemas,
          format,
          title: parsed.info.title,
        };
        return this;
      }
      case 'openapi-yaml': {
        const parsed = parse(OpenAPISchema, parseYaml(content));
        this.root = {
          value: parsed.components.schemas,
          format,
          title: parsed.info.title,
        };
        return this;
      }
      case 'json': {
        const parsed = parse(
          JSONSchemaSchema,
          typeof content === 'string' ? JSON.parse(content) : content
        );
        this.root = {
          value: parsed,
          format,
          title: parsed.title,
        };
        return this;
      }
    }
  }

  public generate() {
    switch (this.root.format) {
      case 'openapi-json':
      case 'openapi-yaml': {
        this.parseOpenAPI(this.root.value);
        break;
      }
      case 'json': {
        this.parseJSONSchema(this.root.value);
        break;
      }
    }

    this.usedImports.add("InferOutput");

    const { circularReferences, selfReferencing } =
      findAndHandleCircularReferences(this.dependsOn);

    const visit = (node: AnyNode, schemaName: string) => {
      if (node.name === 'integer') this.usedImports.add('number');
      else if (node.name === '$ref') {
        /** skip */
      } else if (node.name in customRules) {
        this.customRules.add('uniqueItems');
        for (const imp of customRules[node.name as CustomRules].imports) {
          this.usedImports.add(imp);
        }
      } else this.usedImports.add(node.name as any);

      switch (node.name) {
        case '$ref':
          if (
            (selfReferencing.includes(node.ref) && schemaName === node.ref) ||
            circularReferences[schemaName]?.includes(node.ref)
          ) {
            this.usedImports.add('GenericSchema');
            this.usedImports.add('lazy');
            node.lazy = true;
          }
          break;
        case 'object':
          for (const child of Object.values(node.value)) {
            visit(child, schemaName);
          }
          break;
        case 'union':
          for (const child of node.value) {
            visit(child, schemaName);
          }
          break;
        case 'array':
        case 'optional':
          if (node.value) visit(node.value, schemaName);
          break;
        case 'pipe':
          node.value.forEach((v) => visit(v, schemaName));
          break;
      }
    };

    for (const [schemaName, schema] of Object.entries(this.schemas)) {
      visit(schema, schemaName);
    }

    const output: string[] = [];

    const imports = [...this.usedImports.values()].sort((a, b) => {
      const aStartsWithUpper = /^[A-Z]/.test(a);
      const bStartsWithUpper = /^[A-Z]/.test(b);

      if (aStartsWithUpper && !bStartsWithUpper) return -1;
      else if (!aStartsWithUpper && bStartsWithUpper) return 1;
      else return a.localeCompare(b);
    });
    output.push(`import { `, imports.join(', '), ' } from "valibot";\n');

    const cr = Array.from(this.customRules.values());
    if (cr.length > 0) {
      output.push("\n\n");
      output.push(
        cr.map((rule) => customRules[rule].code).join('\n\n'),
        '\n'
      );
    }

    const schemas = topologicalSort(this.schemas, this.dependsOn);
    for (const [schemaName, schemaNode] of schemas) {
      output.push("\n\n");
      const schemaCode = this.generateSchemaCode(schemaNode);
      if (
        selfReferencing.includes(schemaName) ||
        schemaName in circularReferences
      ) {
        const typeName = schemaName.replace(/Schema/, '');
        const typeDeclaration = this.generateSchemaTypeDeclaration(schemaNode);
        const typeAnnotation =
          selfReferencing.includes(schemaName) ||
          schemaName in circularReferences
            ? `: GenericSchema<${typeName}>`
            : '';
        output.push(`export type ${typeName} = ${typeDeclaration}`, '\n\n');
        output.push(
          `export const ${schemaName}${typeAnnotation} = ${schemaCode};`,
          '\n'
        );
      } else {
        output.push(`export const ${schemaName} = ${schemaCode};`, '\n\n');
        output.push(`export type ${schemaName.replace(/Schema/, '')} = InferOutput<typeof ${schemaName}>;\n`);
      }
    }

    return output.join('');
  }

  private parseJSONSchema(values: JSONSchemaSchema) {
    if (values.definitions) {
      for (const [key, value] of Object.entries(values.definitions)) {
        const name = capitalize(appendSchema(key));
        this.__currentSchema = name;
        this.dependsOn[this.__currentSchema] = [];
        this.refs.set(`#/definitions/${key}`, name);
        this.schemas[name] = this.parseSchema(value, true);
      }
    }

    const name = appendSchema(normalizeTitle(values.title));
    this.__currentSchema = name;
    this.dependsOn[this.__currentSchema] = [];
    this.refs.set(`#/definitions/${name}`, name);

    this.schemas[name] = this.parseObjectType({
      type: 'object',
      properties: values.properties,
      required: values.required,
      description: values.description,
    });
  }

  private parseOpenAPI(values: Record<string, JSONSchema>) {
    for (const key in values) {
      const name = capitalize(key);
      this.refs.set(`#/components/schemas/${key}`, appendSchema(name));
    }

    for (const [key, schema] of Object.entries(values)) {
      const name = appendSchema(capitalize(key));
      this.__currentSchema = name;
      this.dependsOn[this.__currentSchema] = [];
      this.schemas[this.__currentSchema] = this.parseSchema(schema, true);
    }
  }

  private parseSchema<Schema extends JSONSchema>(
    schema: Schema,
    required: boolean
  ): AnyNode {
    if ('$ref' in schema) {
      const schemaName = schema.$ref
        .replace('#/components/schemas/', '')
        .replace('#/definitions/', '');
      this.dependsOn[this.__currentSchema!]!.push(
        appendSchema(capitalize(schemaName))
      );
      return required
        ? schemaNodeReference({ ref: capitalize(appendSchema(schemaName)) })
        : schemaNodeOptional({
            value: schemaNodeReference({
              ref: capitalize(appendSchema(schemaName)),
            }),
          });
    } else if ('type' in schema) {
      switch (schema.type) {
        case 'string':
          if ('enum' in schema) {
            return this.parseEnumType(schema, required);
          } else {
            return this.parseStringType(schema, required);
          }
        case 'number':
        case 'integer':
          if ('enum' in schema) {
            return this.parseEnumType(schema, required);
          } else {
            return this.parseNumberType(schema, required);
          }
        case 'boolean':
          return this.parseBooleanType(schema, required);
        case 'array':
          return this.parseArrayType(schema, required);
        case 'object':
          return this.parseObjectType(schema, required);
        case 'null':
          return this.parseNullType(schema, required);
        default:
          throw new Error(`Unsupported type: ${(schema).type}`);
      }
    } else
      throw new Error(
        '`allOf`, `anyOf`, `oneOf` and `not` are not yet implemented'
      );
  }

  private parseEnumType(
    schema: JSONSchemaString | JSONSchemaNumber,
    required: boolean
  ): AnyNode {
    const actions: ActionNode[] = [];
    const content = schema.enum!.map((value) => {
      const val =
        schema.type === 'string'
          ? `'${value}'`
          : schema.type === 'number' || schema.type === 'integer'
            ? value
            : null;
      return schemaNodeLiteral({ value: val });
    });

    if (schema.description !== undefined) {
      actions.push(actionDescription(schema.description));
    }

    let value: AnyNode = schemaNodeUnion({ value: content });
    if (actions.length) value = methodPipe(value, actions);
    if (!required) value = schemaNodeOptional({ value });
    return value;
  }

  private parseStringType(
    schema: JSONSchemaString,
    required: boolean
  ): AnyNode {
    let value: AnyNode = schemaNodeString();

    const actions: ActionNode[] = [];
    if (schema.minLength !== undefined) {
      actions.push(actionMinLength(schema.minLength));
    }
    if (schema.maxLength !== undefined) {
      this.usedImports.add('maxLength');
      actions.push(actionMaxLength(schema.maxLength));
    }

    if (schema.format === 'email') {
      this.usedImports.add('email');
      actions.push(actionEmail());
    } else if (schema.format === 'uuid') {
      this.usedImports.add('uuid');
      actions.push(actionUUID());
    } else if (schema.format === 'date-time') {
      this.usedImports.add('isoDateTime');
      actions.push(actionIsoDateTime());
    }

    if (schema.pattern) {
      this.usedImports.add('regex');
      actions.push(actionRegex(schema.pattern));
    }

    if (schema.description !== undefined) {
      actions.push(actionDescription(schema.description));
    }

    if (actions.length) value = methodPipe(value, actions);
    if (!required) value = schemaNodeOptional({ value: value });

    return value;
  }

  private parseNumberType(
    schema: JSONSchemaNumber,
    required: boolean
  ): AnyNode {
    let value: AnyNode = schemaNodeNumber();

    const actions: ActionNode[] = [];
    if (schema.minimum !== undefined)
      actions.push(actionMinValue(schema.minimum));
    else if (schema.exclusiveMinimum !== undefined)
      actions.push(actionMinValue(schema.exclusiveMinimum + 1));
    if (schema.maximum !== undefined)
      actions.push(actionMaxValue(schema.maximum));
    else if (schema.exclusiveMaximum !== undefined)
      actions.push(actionMaxValue(schema.exclusiveMaximum - 1));

    if (schema.multipleOf !== undefined)
      actions.push(actionMultipleOf(schema.multipleOf));

    if (schema.description !== undefined) {
      actions.push(actionDescription(schema.description));
    }

    if (actions.length) value = methodPipe(value, actions);
    if (!required) value = schemaNodeOptional({ value });

    return value;
  }

  private parseArrayType(schema: JSONSchemaArray, required: boolean): AnyNode {
    if (!schema.items) {
      return schemaNodeArray({});
    }
    const kind = Array.isArray(schema.items)
      ? schemaNodeUnion({
          value: schema.items.map((item) => this.parseSchema(item, true)),
        })
      : this.parseSchema(schema.items, true);
    let value: AnyNode = schemaNodeArray({ value: kind });
    const actions: ActionNode[] = [];

    if (schema.minItems !== undefined) {
      this.usedImports.add('minLength');
      actions.push(actionMinLength(schema.minItems));
    }
    if (schema.maxItems !== undefined) {
      this.usedImports.add('maxLength');
      actions.push(actionMaxLength(schema.maxItems));
    }
    if (schema.uniqueItems) {
      actions.push(actionUniqueItems());
    }

    if (schema.description !== undefined) {
      actions.push(actionDescription(schema.description));
    }

    if (actions.length) value = methodPipe(value, actions);
    if (!required) value = schemaNodeOptional({ value });

    return value;
  }

  private parseBooleanType(
    schema: JSONSchemaBoolean,
    required: boolean
  ): AnyNode {
    let value: AnyNode = schemaNodeBoolean();
    const actions: ActionNode[] = [];

    if (schema.description !== undefined) {
      actions.push(actionDescription(schema.description));
    }

    if (actions.length) value = methodPipe(value, actions);
    if (!required) value = schemaNodeOptional({ value });
    return value;
  }

  private parseNullType(schema: JSONSchemaNull, required?: boolean): AnyNode {
    let value: AnyNode = schemaNodeNull();
    const actions: ActionNode[] = [];

    if (schema.description !== undefined) {
      actions.push(actionDescription(schema.description));
    }

    if (actions.length) value = methodPipe(value, actions);
    if (!required) value = schemaNodeOptional({ value });
    return value;
  }

  private parseObjectType(schema: JSONSchemaObject, required = true): AnyNode {
    const content = Object.fromEntries(
      Object.entries(schema.properties ?? {})
        .map(([key, value]) => {
          const required = schema.required?.includes(key) ?? false;
          return [key, this.parseSchema(value, required)];
        })
        .filter(Boolean)
    );

    let value: AnyNode = schemaNodeObject({ value: content });
    const actions: ActionNode[] = [];

    if (schema.description !== undefined) {
      actions.push(actionDescription(schema.description));
    }

    if (actions.length) value = methodPipe(value, actions);
    if (!required) value = schemaNodeOptional({ value });

    return value;
  }

  private generateNodeType(node: AnyNode, depth = 1): string {
    switch (node.name) {
      case 'email':
      case 'uuid':
      case 'uniqueItems':
      case 'isoDateTime':
      case 'multipleOf':
      case 'maxLength':
      case 'maxValue':
      case 'minLength':
      case 'minValue':
      case 'regex':
      case 'description': {
        return '';
      }
      case 'pipe': {
        return this.generateNodeType(node.value[0]);
      }
      case 'boolean':
      case 'string':
      case 'number':
      case 'null': {
        return node.name;
      }
      case '$ref': {
        return node.ref.replace(/Schema/, '');
      }
      case 'array': {
        if (!node.value) return `any[]`;
        return `${this.generateNodeType(node.value, depth)}[]`;
      }
      case 'integer': {
        return 'number';
      }
      case 'literal': {
        return typeof node.value === 'string'
          ? `'${node.value}'`
          : `${node.value}`;
      }
      case 'object': {
        const items = Object.entries(node.value);
        if (items.length === 0) return `object`;

        const inner: string = items
          .map(([key, item]) => {
            return item.name === 'optional'
              ? `${'  '.repeat(depth)}${key}?: ${this.generateNodeType(item.value, depth + 1)};\n`
              : `${'  '.repeat(depth)}${key}: ${this.generateNodeType(item, depth + 1)};\n`;
          })
          .join('');
        return `{\n${inner}${'  '.repeat(depth - 1)}}`;
      }
      case 'union': {
        const inner = node.value
          .map((item) => this.generateNodeType(item, depth))
          .join(' | ');
        return `(${inner})`;
      }
      case 'optional': {
        throw new Error('Top-level optional is unsupported');
      }
    }
  }

  private generateNodeCode(node: AnyNode, depth = 1): string {
    switch (node.name) {
      case '$ref':
        if (node.lazy) return `lazy(() => ${node.ref})`;
        return node.ref;
      case 'array':
        if (!node.value) return 'array()';
        return `array(${this.generateNodeCode(node.value, depth)})`;
      case 'boolean':
        return 'boolean()';
      case 'email':
        return `email()`;
      case 'integer':
      case 'number':
        return `number()`;
      case 'isoDateTime':
        return 'isoDateTime()';
      case 'literal':
        return `literal(${node.value})`;
      case 'maxLength':
        return `maxLength(${node.value})`;
      case 'minLength':
        return `minLength(${node.value})`;
      case 'maxValue':
        return `maxValue(${node.value})`;
      case 'minValue':
        return `minValue(${node.value})`;
      case 'multipleOf':
        return `multipleOf(${node.value})`;
      case 'description':
        return `description("${node.value}")`;
      case 'null':
        return 'null()';
      case 'object': {
        const items = Object.entries(node.value);
        if (items.length === 0) return `object({})`;

        const inner: string = items
          .map(
            ([key, item]) =>
              `${'  '.repeat(depth)}${key}: ${this.generateNodeCode(item, depth + 1)},\n`
          )
          .join('');
        return `object({\n${inner}${'  '.repeat(depth - 1)}})`;
      }
      case 'optional':
        return `optional(${this.generateNodeCode(node.value, depth)})`;
      case 'pipe': {
        const inner: string = node.value
          .map((item) => this.generateNodeCode(item, depth))
          .join(', ');
        return `pipe(${inner})`;
      }
      case 'regex': {
        return `regex(/${node.value}/)`;
      }
      case 'string': {
        return `string()`;
      }
      case 'union': {
        const inner: string =
          node.value
            ?.map(
              (item) =>
                `${'  '.repeat(depth)}${this.generateNodeCode(item, depth + 1)},\n`
            )
            .join('') ?? '';
        return `union([\n${inner}${'  '.repeat(depth - 1)}])`;
      }
      case 'uniqueItems': {
        return `uniqueItems()`;
      }
      case 'uuid': {
        return 'uuid()';
      }
    }
  }

  private generateSchemaTypeDeclaration(schema: AnyNode): string {
    return this.generateNodeType(schema);
  }

  private generateSchemaCode(schema: AnyNode): string {
    return this.generateNodeCode(schema);
  }
}

export { ValibotGenerator };
