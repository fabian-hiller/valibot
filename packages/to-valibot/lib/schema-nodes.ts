type ExtractAdditionalProps<T extends { name: string }> = {
  [K in keyof T as K extends keyof { name: string } ? never : K]: T[K];
};
type ExtractRequiredKeys<T extends object> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K;
}[keyof T];

type HasProps<T extends object> = keyof T extends never ? false : true;

type MethodNodeBase<Name extends string, Value> = {
  name: Name;
  value: Value;
};
type MethodNodePipe = MethodNodeBase<'pipe', AnyNode[]>;
const methodPipe = (item: AnyNode, value: AnyNode[]): MethodNodePipe => ({
  name: 'pipe',
  value: [item, ...value],
});

type MethodNode = MethodNodePipe;

type Action<Node extends ActionNode> = Node extends { value: infer V }
  ? (value: V, message?: string) => Node
  : (message?: string) => Node;

type ActionNodeBase<
  Name extends string,
  Value = undefined,
> = Value extends undefined
  ? {
      name: Name;
      message?: string | undefined;
      custom?: true;
    }
  : {
      value: Value;
      name: Name;
      message?: string | undefined;
      custom?: true;
    };

type ActionNodeInteger = ActionNodeBase<'integer'>;
const actionInteger: Action<ActionNodeInteger> = (message) => ({
  name: 'integer',
  message
});

type ActionNodeMinLength = ActionNodeBase<'minLength', number>;
const actionMinLength: Action<ActionNodeMinLength> = (value, message) => ({
  name: 'minLength',
  value,
  message,
});

type ActionNodeMaxLength = ActionNodeBase<'maxLength', number>;
const actionMaxLength: Action<ActionNodeMaxLength> = (value, message) => ({
  name: 'maxLength',
  value,
  message,
});

type ActionNodeMinValue = ActionNodeBase<'minValue', number>;
const actionMinValue: Action<ActionNodeMinValue> = (value, message) => ({
  name: 'minValue',
  value,
  message,
});

type ActionNodeMaxValue = ActionNodeBase<'maxValue', number>;
const actionMaxValue: Action<ActionNodeMaxValue> = (value, message) => ({
  name: 'maxValue',
  value,
  message,
});

type ActionNodeMultipleOf = ActionNodeBase<'multipleOf', number>;
const actionMultipleOf: Action<ActionNodeMultipleOf> = (value, message) => ({
  name: 'multipleOf',
  value,
  message,
});

type ActionNodeRegex = ActionNodeBase<'regex', string>;
const actionRegex: Action<ActionNodeRegex> = (value, message) => ({
  name: 'regex',
  value,
  message,
});

type ActionNodeUniqueItems = ActionNodeBase<'uniqueItems'>;
const actionUniqueItems: Action<ActionNodeUniqueItems> = (message) => ({
  name: 'uniqueItems',
  custom: true,
  message,
});

type ActionNodeEmail = ActionNodeBase<'email'>;
const actionEmail: Action<ActionNodeEmail> = (message) => ({
  name: 'email',
  message,
});

type ActionNodeUUID = ActionNodeBase<'uuid'>;
const actionUUID: Action<ActionNodeUUID> = (message) => ({
  name: 'uuid',
  message,
});

type ActionNodeIsoDateTime = ActionNodeBase<'isoDateTime'>;
const actionIsoDateTime: Action<ActionNodeIsoDateTime> = (message) => ({
  name: 'isoDateTime',
  message,
});

type ActionNodeIsoDate = ActionNodeBase<'isoDate'>;
const actionIsoDate: Action<ActionNodeIsoDate> = (message) => ({
  name: 'isoDate',
  message,
});

type ActionNodeIsoTime = ActionNodeBase<'isoTime'>;
const actionIsoTime: Action<ActionNodeIsoTime> = (message) => ({
  name: 'isoTime',
  message,
});

type ActionNodeDescription = ActionNodeBase<'description', string>;
const actionDescription: Action<ActionNodeDescription> = (value) => ({
  name: 'description',
  value,
});

type ActionNodeIPv4 = ActionNodeBase<'ipv4'>;
const actionIPv4: Action<ActionNodeIPv4> = (message) => ({
  name: 'ipv4',
  message,
});

type ActionNodeIPv6 = ActionNodeBase<'ipv6'>;
const actionIPv6: Action<ActionNodeIPv6> = (message) => ({
  name: 'ipv6',
  message,
});

type ActionNode =
  | ActionNodeInteger
  | ActionNodeMinLength
  | ActionNodeMaxLength
  | ActionNodeMinValue
  | ActionNodeMaxValue
  | ActionNodeMultipleOf
  | ActionNodeEmail
  | ActionNodeUUID
  | ActionNodeIsoDateTime
  | ActionNodeIsoDate
  | ActionNodeIsoTime
  | ActionNodeRegex
  | ActionNodeUniqueItems
  | ActionNodeDescription
  | ActionNodeIPv4
  | ActionNodeIPv6;

type SchemaNodeBase<Name extends string> = {
  name: Name;
  message?: string;
};

type NodeFactory<Node extends SchemaNode> =
  HasProps<ExtractAdditionalProps<Node>> extends true
    ? ExtractRequiredKeys<ExtractAdditionalProps<Node>> extends never
      ? (props?: Omit<Node, 'name'>) => Node
      : (props: Omit<Node, 'name'>) => Node
    : () => Node;

type SchemaNodeString = SchemaNodeBase<'string'>;
const schemaNodeString: NodeFactory<SchemaNodeString> = (props) => ({
  name: 'string',
  ...props,
});

type SchemaNodeNumber = SchemaNodeBase<'number'>;
const schemaNodeNumber: NodeFactory<SchemaNodeNumber> = (props) => ({
  name: 'number',
  ...props,
});

type SchemaNodeInteger = SchemaNodeBase<'integer'>;
const schemaNodeInteger: NodeFactory<SchemaNodeInteger> = (props) => ({
  name: 'integer',
  ...props,
});

type SchemaNodeBoolean = SchemaNodeBase<'boolean'>;
const schemaNodeBoolean: NodeFactory<SchemaNodeBoolean> = (props) => ({
  name: 'boolean',
  ...props,
});

type SchemaNodeObject = SchemaNodeBase<'object'> & ({
  value: Record<string, AnyNode>;
  type: "object" | "strictObject" | "objectWithRest";
  withRest?: AnyNode;
});

const schemaNodeObject: NodeFactory<SchemaNodeObject> = (props) => ({
  name: 'object',
  ...props,
});

type SchemaNodeArray = SchemaNodeBase<'array'> & {
  value?: AnyNode;
};
const schemaNodeArray: NodeFactory<SchemaNodeArray> = (props) => ({
  name: 'array',
  ...props,
});

type SchemaNodeUnion = SchemaNodeBase<'union'> & {
  value: AnyNode[];
};
const schemaNodeUnion: NodeFactory<SchemaNodeUnion> = (props) => ({
  name: 'union',
  ...props,
});

type SchemaNodeAllOf = SchemaNodeBase<'allOf'> & {
  value: AnyNode[];
}
const schemaNodeAllOf: NodeFactory<SchemaNodeAllOf> = (props) => ({
  name: 'allOf',
  ...props,
});

type SchemaNodeAnyOf = SchemaNodeBase<'anyOf'> & {
  value: AnyNode[];
}
const schemaNodeAnyOf: NodeFactory<SchemaNodeAnyOf> = (props) => ({
  name: 'anyOf',
  ...props,
});

type SchemaNodeOneOf = SchemaNodeBase<'oneOf'> & {
  value: AnyNode[];
}
const schemaNodeOneOf: NodeFactory<SchemaNodeOneOf> = (props) => ({
  name: 'oneOf',
  ...props,
});

type SchemaNodeNot = SchemaNodeBase<'not'> & {
  value: AnyNode;
}
const schemaNodeNot: NodeFactory<SchemaNodeNot> = (props) => ({
  name: 'not',
  ...props,
});

type SchemaNodeNull = SchemaNodeBase<'null'>;
const schemaNodeNull: NodeFactory<SchemaNodeNull> = (props) => ({
  name: 'null',
  ...props,
});

type SchemaNodeLiteral = SchemaNodeBase<'literal'> & {
  value?: string | number;
};
const schemaNodeLiteral: NodeFactory<SchemaNodeLiteral> = (props) => ({
  name: 'literal',
  ...props,
});

type SchemaNodeOptional = SchemaNodeBase<'optional'> & {
  value: AnyNode;
};
const schemaNodeOptional: NodeFactory<SchemaNodeOptional> = (props) => ({
  name: 'optional',
  ...props,
});

type SchemaNodeReference = SchemaNodeBase<'$ref'> & {
  ref: string;
  lazy?: boolean;
};
const schemaNodeReference: NodeFactory<SchemaNodeReference> = (props) => ({
  name: '$ref',
  ...props,
});

type SchemaNodeConst = SchemaNodeBase<'const'> & {
  value: any
};
const schemaNodeConst: NodeFactory<SchemaNodeConst> = (props) => ({
  name: 'const',
  ...props,
});

type SchemaNode =
  | SchemaNodeString
  | SchemaNodeNumber
  | SchemaNodeInteger
  | SchemaNodeBoolean
  | SchemaNodeObject
  | SchemaNodeArray
  | SchemaNodeUnion
  | SchemaNodeNull
  | SchemaNodeOptional
  | SchemaNodeLiteral
  | SchemaNodeReference
  | SchemaNodeAllOf
  | SchemaNodeAnyOf
  | SchemaNodeOneOf
  | SchemaNodeNot
  | SchemaNodeConst;

type AnyNode = SchemaNode | MethodNode | ActionNode;

export type { ActionNode, AnyNode, SchemaNode };
export {
  methodPipe,
  actionInteger,
  actionMinLength,
  actionMaxLength,
  actionEmail,
  actionIsoDateTime,
  actionIsoDate,
  actionIsoTime,
  actionUUID,
  actionRegex,
  actionUniqueItems,
  actionMaxValue,
  actionMinValue,
  actionMultipleOf,
  actionDescription,
  actionIPv4,
  actionIPv6,
  schemaNodeString,
  schemaNodeNumber,
  schemaNodeBoolean,
  schemaNodeObject,
  schemaNodeArray,
  schemaNodeUnion,
  schemaNodeInteger,
  schemaNodeOptional,
  schemaNodeNull,
  schemaNodeLiteral,
  schemaNodeReference,
  schemaNodeAllOf,
  schemaNodeAnyOf,
  schemaNodeNot,
  schemaNodeOneOf,
  schemaNodeConst
};
