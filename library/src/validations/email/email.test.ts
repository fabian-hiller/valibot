import { describe, expect, test } from 'vitest';
import { email } from './email.ts';

describe('email', () => {
  const info = { reason: 'any' as const };

  test('should pass only emails', () => {
    const validate = email();
    const value1 = 'email@example.com';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = 'firstname.lastname@example.com';
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = 'email@subdomain.example.com';
    expect(validate(value3, info)).toEqual({ output: value3 });
    const value4 = 'firstname+lastname@example.com';
    expect(validate(value4, info)).toEqual({ output: value4 });
    const value5 = 'email@123.123.123.123';
    expect(validate(value5, info)).toEqual({ output: value5 });
    const value6 = '“email”@example.com';
    expect(validate(value6, info)).toEqual({ output: value6 });
    const value7 = '1234567890@example.com';
    expect(validate(value7, info)).toEqual({ output: value7 });
    const value8 = 'email@example-one.com';
    expect(validate(value8, info)).toEqual({ output: value8 });
    const value9 = '_______@example.com';
    expect(validate(value9, info)).toEqual({ output: value9 });
    const value10 = 'email@example.name';
    expect(validate(value10, info)).toEqual({ output: value10 });
    const value11 = 'email@example.co.uk';
    expect(validate(value11, info)).toEqual({ output: value11 });
    const value12 = 'firstname-lastname@example.com';
    expect(validate(value12, info)).toEqual({ output: value12 });
    const value13 = 'email@subdomain.subdomain.example.de';
    expect(validate(value13, info)).toEqual({ output: value13 });

    expect(validate('plainaddress', info).issues?.length).toBe(1);
    expect(validate('#@%^%#$@#$@#.com', info).issues?.length).toBe(1);
    expect(validate('@example.com', info).issues?.length).toBe(1);
    expect(validate('Joe Smith <email@example.com>', info).issues?.length).toBe(
      1
    );
    expect(validate('email.example.com', info).issues?.length).toBe(1);
    expect(validate('email@example@example.com', info).issues?.length).toBe(1);
    expect(validate('.email@example.com', info).issues?.length).toBe(1);
    expect(validate('email.@example.com', info).issues?.length).toBe(1);
    expect(validate('email..email@example.com', info).issues?.length).toBe(1);
    // FIXME: expect(validate('あいうえお@example.com', info).issues?.length).toBe(1);
    expect(validate('email@example.com (Joe Smith)', info).issues?.length).toBe(
      1
    );
    expect(validate('email@example', info).issues?.length).toBe(1);
    // FIXME: expect(validate('email@-example.com', info).issues?.length).toBe(1);
    // FIXME: expect(validate('email@111.222.333.44444', info).issues?.length).toBe(1);
    expect(validate('email@example..com', info).issues?.length).toBe(1);
    expect(validate('Abc..123@example.com', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value is not an email!';
    const validate = email(error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
