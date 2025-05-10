import * as v from "valibot";

const Person = v.object({
  name: v.string(),
});

const Employee = v.object({
  role: v.string(),
});

const Schema1 = v.intersect([Person, Employee]);

const Student = v.object({
  favSubject: v.string(),
});

const Schema2 = v.intersect([Person, Employee, Student]);