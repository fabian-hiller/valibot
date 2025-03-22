import { describe, expect, it } from 'vitest';
import { findAndHandleCircularReferences } from './circular-refs';

describe('#findAndHandleCircularReferences()', () => {
  it('should find self-referencing schemas', () => {
    const output = findAndHandleCircularReferences({
      TreeNodeSchema: ['TreeNodeSchema'],
      LinkedListNodeSchema: ['LinkedListNodeSchema'],
      SelfRefSchema: ['TreeNodeSchema', 'LinkedListNodeSchema'],
    });
    expect(output).toEqual({
      selfReferencing: ['TreeNodeSchema', 'LinkedListNodeSchema'],
      circularReferences: {},
    });
  });

  it('should find circular referencing schemas', () => {
    const output = findAndHandleCircularReferences({
      PersonSchema: ['PersonSchema'],
      CompanySchema: ['EmployeeSchema'],
      EmployeeSchema: ['CompanySchema', 'EmployeeSchema'],
      CircularRefsSchema: ['PersonSchema', 'CompanySchema'],
    });
    expect(output).toEqual({
      selfReferencing: ['PersonSchema', 'EmployeeSchema'],
      circularReferences: {
        EmployeeSchema: ['CompanySchema'],
        CompanySchema: ['EmployeeSchema'],
      },
    });
  });
});
