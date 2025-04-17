import { z } from "zod";

const Person = z.object({
  name: z.string(),
});

const Employee = z.object({
  role: z.string(),
});

const Schema1 = z.intersection(Person, Employee);

const Student = z.object({
  favSubject: z.string(),
});

const Schema2 = Person.and(Employee).and(Student);