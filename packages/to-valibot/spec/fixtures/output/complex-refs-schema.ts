import { CheckItemsAction, InferOutput, array, checkItems, isoDateTime, literal, object, optional, pipe, string, union, uuid } from "valibot";


const uniqueItems = <Type, Message extends string>(
  message?: Message
): CheckItemsAction<Type[], Message | undefined> =>
  checkItems((item, i, arr) => arr.indexOf(item) === i, message);


export const StatusSchema = union([
  literal('active'),
  literal('inactive'),
  literal('pending'),
  literal('suspended'),
]);

export type Status = InferOutput<typeof StatusSchema>;


export const PrioritySchema = union([
  literal('low'),
  literal('medium'),
  literal('high'),
  literal('critical'),
]);

export type Priority = InferOutput<typeof PrioritySchema>;


export const CategorySchema = union([
  literal('bug'),
  literal('feature'),
  literal('enhancement'),
  literal('documentation'),
]);

export type Category = InferOutput<typeof CategorySchema>;


export const SeveritySchema = union([
  literal('trivial'),
  literal('minor'),
  literal('major'),
  literal('critical'),
]);

export type Severity = InferOutput<typeof SeveritySchema>;


export const UserRoleSchema = union([
  literal('admin'),
  literal('manager'),
  literal('developer'),
  literal('viewer'),
]);

export type UserRole = InferOutput<typeof UserRoleSchema>;


export const PermissionSchema = object({
  action: union([
    literal('read'),
    literal('write'),
    literal('delete'),
    literal('execute'),
  ]),
  resource: string(),
});

export type Permission = InferOutput<typeof PermissionSchema>;


export const UserSchema = object({
  id: pipe(string(), uuid()),
  username: string(),
  role: UserRoleSchema,
  permissions: optional(array(PermissionSchema)),
});

export type User = InferOutput<typeof UserSchema>;


export const CommentSchema = object({
  id: pipe(string(), uuid()),
  content: string(),
  author: UserSchema,
  createdAt: pipe(string(), isoDateTime()),
});

export type Comment = InferOutput<typeof CommentSchema>;


export const IssueSchema = object({
  id: pipe(string(), uuid()),
  title: string(),
  description: string(),
  status: StatusSchema,
  priority: PrioritySchema,
  category: CategorySchema,
  severity: SeveritySchema,
  assignee: optional(UserSchema),
  reporter: UserSchema,
  comments: optional(array(CommentSchema)),
  relatedIssues: optional(array(pipe(string(), uuid()))),
  tags: optional(pipe(array(string()), uniqueItems())),
  createdAt: pipe(string(), isoDateTime()),
  updatedAt: optional(pipe(string(), isoDateTime())),
});

export type Issue = InferOutput<typeof IssueSchema>;


export const ProjectSchema = object({
  id: pipe(string(), uuid()),
  name: string(),
  description: optional(string()),
  status: optional(StatusSchema),
  owner: UserSchema,
  members: optional(array(UserSchema)),
  issues: optional(array(IssueSchema)),
  createdAt: pipe(string(), isoDateTime()),
});

export type Project = InferOutput<typeof ProjectSchema>;


export const ComplexRefsSchema = object({
  projects: array(ProjectSchema),
  users: optional(array(UserSchema)),
});

export type ComplexRefs = InferOutput<typeof ComplexRefsSchema>;
