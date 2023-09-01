import { describe, expect, test } from 'vitest';

import { email } from './email.ts';

describe('email', () => {
  test('should pass only emails', () => {
    const validate = email();
    const value1 = 'email@example.com';
    expect(validate(value1).output).toBe(value1);
    const value2 = 'firstname.lastname@example.com';
    expect(validate(value2).output).toBe(value2);
    const value3 = 'email@subdomain.example.com';
    expect(validate(value3).output).toBe(value3);
    const value4 = 'firstname+lastname@example.com';
    expect(validate(value4).output).toBe(value4);
    const value5 = 'email@123.123.123.123';
    expect(validate(value5).output).toBe(value5);
    const value6 = '“email”@example.com';
    expect(validate(value6).output).toBe(value6);
    const value7 = '1234567890@example.com';
    expect(validate(value7).output).toBe(value7);
    const value8 = 'email@example-one.com';
    expect(validate(value8).output).toBe(value8);
    const value9 = '_______@example.com';
    expect(validate(value9).output).toBe(value9);
    const value10 = 'email@example.name';
    expect(validate(value10).output).toBe(value10);
    const value11 = 'email@example.co.uk';
    expect(validate(value11).output).toBe(value11);
    const value12 = 'firstname-lastname@example.com';
    expect(validate(value12).output).toBe(value12);
    const value13 = 'email@subdomain.subdomain.example.de';
    expect(validate(value13).output).toBe(value13);

    expect(validate('plainaddress').issue).toBeTruthy();
    expect(validate('#@%^%#$@#$@#.com').issue).toBeTruthy();
    expect(validate('@example.com').issue).toBeTruthy();
    expect(validate('Joe Smith <email@example.com>').issue).toBeTruthy();
    expect(validate('email.example.com').issue).toBeTruthy();
    expect(validate('email@example@example.com').issue).toBeTruthy();
    expect(validate('.email@example.com').issue).toBeTruthy();
    expect(validate('email.@example.com').issue).toBeTruthy();
    expect(validate('email..email@example.com').issue).toBeTruthy();
    // FIXME: expect(validate('あいうえお@example.com').issue).toBeTruthy();
    expect(validate('email@example.com (Joe Smith)').issue).toBeTruthy();
    expect(validate('email@example').issue).toBeTruthy();
    // FIXME: expect(validate('email@-example.com').issue).toBeTruthy();
    // FIXME: expect(validate('email@111.222.333.44444').issue).toBeTruthy();
    expect(validate('email@example..com').issue).toBeTruthy();
    expect(validate('Abc..123@example.com').issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an email!';
    const validate = email(error);
    expect(validate('test').issue?.message).toBe(error);
  });
});
