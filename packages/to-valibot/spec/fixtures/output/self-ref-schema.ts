import { GenericSchema, InferOutput, array, lazy, object, optional, pipe, string, uuid } from "valibot";


export type TreeNode = {
  id: string;
  name: string;
  children?: TreeNode[];
}

export const TreeNodeSchema: GenericSchema<TreeNode> = object({
  id: pipe(string(), uuid()),
  name: string(),
  children: optional(array(lazy(() => TreeNodeSchema))),
});


export type LinkedListNode = {
  value: string;
  next?: LinkedListNode;
}

export const LinkedListNodeSchema: GenericSchema<LinkedListNode> = object({
  value: string(),
  next: optional(lazy(() => LinkedListNodeSchema)),
});


export const SelfRefSchema = object({
  tree: TreeNodeSchema,
  linkedList: LinkedListNodeSchema,
});

export type SelfRef = InferOutput<typeof SelfRefSchema>;
