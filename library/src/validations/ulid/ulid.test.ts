import { describe, expect, test } from 'vitest';
import { ulid } from './ulid.ts';

describe('ulid', () => {
  test('should pass only ULIDs', () => {
    const validate = ulid();

    const value1 = '01H9YWG755E7ZPXKPE57GQWHCY';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '01H9YWGTGVJA06FZZCRPMHAMWH';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '01H9YWH3GF0S3SRJ952RN0TGTX';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = '01H9YWHHJS6DJ39WMVMT64CXTB';
    expect(validate._parse(value4).output).toBe(value4);
    const value5 = '01H9YWHSQV4ZC0WM0YKNJ14EG0';
    expect(validate._parse(value5).output).toBe(value5);
    const value6 = value5.toLowerCase();
    expect(validate._parse(value6).output).toBe(value6);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('01H9YWG755E7ZPXKPE57GQWHC').issues).toBeTruthy();
    expect(validate._parse('01H9YWG755E7ZPXKPE57GQWHCYA').issues).toBeTruthy();
    expect(validate._parse('01H9YWG755E7ZPXKPE57GQWHCI').issues).toBeTruthy();
    expect(validate._parse('01H9YWG755E7ZPXKPE57GQWHCL').issues).toBeTruthy();
    expect(validate._parse('01H9YWG755E7ZPXKPE57GQWHCO').issues).toBeTruthy();
    expect(validate._parse('01H9YWG755E7ZPXKPE57GQWHCU').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an ULID!';
    const validate = ulid(error);
    expect(validate._parse('test').issues?.[0].context.message).toBe(error);
  });
});
