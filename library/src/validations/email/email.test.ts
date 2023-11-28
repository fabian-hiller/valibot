import { describe, expect, test } from 'vitest';
import { email } from './email.ts';

describe('email', () => {
  const validate = email();

  test('should pass standard email', () => {
    const value = 'email@example.com';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should pass email with country code top level domain', () => {
    const value = 'email@example.co.uk';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should pass email with dot in local part', () => {
    const value = 'firstname.lastname@example.com';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should pass email with hyphen in local part', () => {
    const value = 'firstname-lastname@example.com';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should pass email with plus in local part', () => {
    const value = 'firstname+lastname@example.com';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should pass email with hyphen in domain part', () => {
    const value = 'email@aaa-bbb.com';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should pass email with long top level domain', () => {
    const value = 'email@example.technology';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should pass email with numerical local part', () => {
    const value = '1234567890@example.com';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should pass email with numerical local part', () => {
    const value = '1234567890@example.com';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should pass email with subdomain', () => {
    const value = 'email@subdomain.example.com';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should pass email with subdomain and hyphen in domain', () => {
    const value = 'email@subdomain.aaa-bbb.com';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should pass email with subdomain and country code top level domain', () => {
    const value = 'email@subdomain.example.co.uk';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should pass email with short domain and top level domain', () => {
    const value = 'email@ab.cd';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should pass email with numeric domain and top level domain', () => {
    const value = 'email@123.com';
    expect(validate._parse(value).output).toBe(value);
  });

  test('should reject email with missing @ symbol', () => {
    const value = 'example.com';
    expect(validate._parse(value)).toBeTruthy();
  });

  test('should reject email with missing domain', () => {
    const value = 'email@.com';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email with special chars in top level domain', () => {
    const value = '#@%^%#$@#$@#.com';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email with no top-level domain', () => {
    const value = 'email@example';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email with numeric top-level domain', () => {
    const value = 'email@example.123';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email with only domain', () => {
    const value = '@example.com';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email with only local part', () => {
    const value = 'email@';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email with spaces', () => {
    const value = ' email@example.com ';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email with multiple @ symbols', () => {
    const value = ' email@@example.com ';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email where local part is longer or equal 64 chars', () => {
    const value =
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@example.com';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email where domain part is longer or equal 255 chars', () => {
    const value =
      'email@exaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaample.com';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email where domain consists from numerical values', () => {
    const value = 'email@111.222.333.44444';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email where local part consists of non ASCII chars', () => {
    const value = 'あいうえお@example.com';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email where local part begin with dot', () => {
    const value = '.email@example.com';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email where local part end with special char', () => {
    const value = 'email.@example.com';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email where domain part end with special char', () => {
    const value = 'email@-example.com';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email where domain part end with special char', () => {
    const value = 'email@example-.com';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email where two dots separate in local part', () => {
    const value = 'email..email@example.com';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email where name is represented in front of email', () => {
    const value = 'Joe Smith <email@example.com>';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should reject email where name is represented after email', () => {
    const value = 'email@example.com (Joe Smith)';
    expect(validate._parse(value).issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an email!';
    const validate = email(error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
