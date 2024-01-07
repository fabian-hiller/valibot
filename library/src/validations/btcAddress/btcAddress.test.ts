import { describe, expect, test } from 'vitest';
import { btcAddress } from './btcAddress.ts';

describe('btcAddress', () => {
  test('should pass valid btc addresses', () => {
    const validate = btcAddress();

    const value1 = '1BoatSLRHtKNngkdXEeobR76b53LETtpyT';
    expect(validate._parse(value1).output).toBe(value1);

    const value2 = '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy';
    expect(validate._parse(value2).output).toBe(value2);

    const value3 = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';
    expect(validate._parse(value3).output).toBe(value3);

    const value4 = '14qViLJfdGaP4EeHnDyJbEGQysnCpwk3gd';
    expect(validate._parse(value4).output).toBe(value4);

    const value5 = '35bSzXvRKLpHsHMrzb82f617cV4Srnt7hS';
    expect(validate._parse(value5).output).toBe(value5);

    const value6 = '17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhemt';
    expect(validate._parse(value6).output).toBe(value6);

    const value7 = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';
    expect(validate._parse(value7).output).toBe(value7);

    const value8 =
      'bc1ptxs597p3fnpd8gwut5p467ulsydae3rp9z75hd99w8k3ljr9g9rqx6ynaw';
    expect(validate._parse(value8).output).toBe(value8);
  });

  test('should reject invalid btc addresses', () => {
    const validate = btcAddress();
    expect(validate._parse('').issues).toBeTruthy();
    expect(
      validate._parse('4J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy').issues
    ).toBeTruthy();
    expect(
      validate._parse('0x56F0B8A998425c53c75C4A303D4eF987533c5597').issues
    ).toBeTruthy();
    expect(
      validate._parse('pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g').issues
    ).toBeTruthy();
    expect(
      validate._parse('17VZNX1SN5NlKa8UQFxwQbFeFc3iqRYhem').issues
    ).toBeTruthy();
    expect(
      validate._parse('BC1QW508D6QEJXTDG4Y5R3ZARVAYR0C5XW7KV8F3T4').issues
    ).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not a valid btc address!';
    const validate = btcAddress(error);
    expect(validate._parse('').issues?.[0].message).toBe(error);
  });
});
