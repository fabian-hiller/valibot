import { describe, expect, test } from 'vitest';
import { email } from './email';

describe('email', () => {
  const info = { reason: 'any' as const };

  test('should pass only emails', () => {
    const validate = email();
    const value1 = 'email@example.com';
    expect(validate(value1, info)).toBe(value1);
    const value2 = 'firstname.lastname@example.com';
    expect(validate(value2, info)).toBe(value2);
    const value3 = 'email@subdomain.example.com';
    expect(validate(value3, info)).toBe(value3);
    const value4 = 'firstname+lastname@example.com';
    expect(validate(value4, info)).toBe(value4);
    const value5 = 'email@123.123.123.123';
    expect(validate(value5, info)).toBe(value5);
    const value6 = '“email”@example.com';
    expect(validate(value6, info)).toBe(value6);
    const value7 = '1234567890@example.com';
    expect(validate(value7, info)).toBe(value7);
    const value8 = 'email@example-one.com';
    expect(validate(value8, info)).toBe(value8);
    const value9 = '_______@example.com';
    expect(validate(value9, info)).toBe(value9);
    const value10 = 'email@example.name';
    expect(validate(value10, info)).toBe(value10);
    const value11 = 'email@example.co.uk';
    expect(validate(value11, info)).toBe(value11);
    const value12 = 'firstname-lastname@example.com';
    expect(validate(value12, info)).toBe(value12);
    const value13 = 'email@subdomain.subdomain.example.de';
    expect(validate(value13, info)).toBe(value13);

    expect(() => validate('plainaddress', info)).toThrowError();
    expect(() => validate('#@%^%#$@#$@#.com', info)).toThrowError();
    expect(() => validate('@example.com', info)).toThrowError();
    expect(() =>
      validate('Joe Smith <email@example.com>', info)
    ).toThrowError();
    expect(() => validate('email.example.com', info)).toThrowError();
    expect(() => validate('email@example@example.com', info)).toThrowError();
    expect(() => validate('.email@example.com', info)).toThrowError();
    expect(() => validate('email.@example.com', info)).toThrowError();
    expect(() => validate('email..email@example.com', info)).toThrowError();
    // FIXME: expect(() => validate('あいうえお@example.com', info)).toThrowError();
    expect(() =>
      validate('email@example.com (Joe Smith)', info)
    ).toThrowError();
    expect(() => validate('email@example', info)).toThrowError();
    // FIXME: expect(() => validate('email@-example.com', info)).toThrowError();
    // FIXME: expect(() => validate('email@111.222.333.44444', info)).toThrowError();
    expect(() => validate('email@example..com', info)).toThrowError();
    expect(() => validate('Abc..123@example.com', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an email!';
    const validate = email(error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
