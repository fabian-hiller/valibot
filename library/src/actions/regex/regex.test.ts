import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { regex, type RegexAction, type RegexIssue } from './regex.ts';

describe('regex', () => {
  describe('should return action object', () => {
    const baseAction: Omit<RegexAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'regex',
      reference: regex,
      expects: '/^ID-\\d{3}$/u',
      requirement: /^ID-\d{3}$/u,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: RegexAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(regex(/^ID-\d{3}$/u)).toStrictEqual(action);
      expect(regex(/^ID-\d{3}$/u, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(regex(/^ID-\d{3}$/u, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies RegexAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(regex(/^ID-\d{3}$/u, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies RegexAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for untyped inputs', () => {
      expect(
        regex(/^ID-\d{3}$/u)._run({ typed: false, value: null }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid inputs of simple regex', () => {
      expectNoActionIssue(regex(/Valibot/iu), [
        'Validate unknown data with Valibot.',
        'Validate unknown data with valibot.',
        'Valibot is an open source schema library.',
        'valibot is an open source schema library.',
        'Validate unknown data with Valibot - an open source schema library',
        'Validate unknown data with valibot - an open source schema library',
      ]);
    });

    test('for valid inputs of regex containing character classes', () => {
      // eslint-disable-next-line regexp/prefer-quantifier
      expectNoActionIssue(regex(/\b\d\d:\d\d/u), [
        '23:59',
        '00:00!',
        'What is 05:37pm in the 24 hour-format?',
        'It is 17:37.',
        'Is 12:345 valid?',
      ]);
    });

    test('for valid inputs of regexes containing anchors', () => {
      expectNoActionIssue(regex(/^\d\./mu), [
        'Ordered list of fruits: \n1. Apple \n2. Mango \n3. Banana',
        '1.1 An Introduction to TypeScript',
      ]);

      expectNoActionIssue(regex(/bot\.$/imu), [
        'Valibot.',
        'ValiBoT.',
        'I am using Valibot.\n It is good library.',
      ]);

      expectNoActionIssue(regex(/^$/mu), ['']);

      expectNoActionIssue(regex(/^\d{2}:\d{2}$/mu), [
        '00:00',
        '21:00\n22:15\n23:30',
      ]);
    });

    test('for valid inputs of regexes containing ranges & quantifiers', () => {
      expectNoActionIssue(regex(/#[a-f0-9]{6}/iu), [
        '#000000',
        '#FFFFFF',
        '#ffffff',
        'Apples are #FF0000 in color.',
        '#4B81A7 HEX\n75, 129, 167 RGB\n205, 55%, 47% HSL',
      ]);

      expectNoActionIssue(regex(/[^aeiou]+/iu), [
        'dog',
        '123',
        '@#$%^&*',
        'Shhhhh!',
        'Why cry?',
      ]);

      expectNoActionIssue(regex(/\w{3,}/u), [
        'bye',
        'hello',
        'test@123',
        '123',
        '_underscore',
        '123hi',
      ]);

      expectNoActionIssue(regex(/\b\d{3,5}\b/u), [
        '874',
        '1000',
        '98765',
        'hello, mic test 123, check',
        'I have $1134',
        '12345 is a very weak password.',
      ]);
    });

    test('for valid inputs of regexes containing capturing groups', () => {
      expectNoActionIssue(regex(/(?:ha){2,}/iu), [
        'haha',
        'hahaha',
        "Hahaha, that's hilarious!",
        'I meant to do that. Hahaha',
        'And then, hahaha, the cat stole my sandwich!',
      ]);

      expectNoActionIssue(regex(/<(([a-z]+)\s([^>]*))>/iu), [
        '<a href = "https://valibot.dev/">',
        '<span >',
        '<div >',
        'The <img > tag is used to add an image in an HTML page.',
        'Tag used to add an image in an HTML page? <img >',
      ]);

      expectNoActionIssue(regex(/(?<hr>\d{2})[:-](?<min>\d{2})/u), [
        '23:55',
        '00-00',
        "It's 10:00. I am late.",
        'I will reach home by 21-00',
        '20:00 - I was playing games.',
      ]);
    });

    test('for valid inputs of regexes containing backreferences', () => {
      expectNoActionIssue(regex(/(["'`])(['"`\w]+)\1/u), [
        "A valid string: '`hello'",
        "`'hello` is also a valid string",
        'Even "`hello" is a valid string',
      ]);

      expectNoActionIssue(regex(/(?<quote>["'`])(['"`\w]+)\k<quote>/u), [
        "A string: '`hello'",
        "`'hello` is also a valid string",
        'Even "`hello" is a valid',
      ]);
    });

    test('for valid inputs of regexes containing alternation', () => {
      expectNoActionIssue(regex(/\b(?:css|html|javascript)\b/iu), [
        'HTML',
        'CSS',
        'JavaScript',
        'Build websites using HTML, CSS and JavaScript.',
      ]);
    });

    test('for valid inputs of regexes containing lookahead or lookbehind', () => {
      expectNoActionIssue(regex(/\b\d(?=€)/u), [
        '5€',
        '1 candy costs 1€',
        '1 candy costs 1€.',
        '1€ for a candy.',
      ]);

      expectNoActionIssue(regex(/(?<=₹)\d{2}/u), [
        '₹50',
        '1 candy costs ₹12',
        '1 candy costs ₹12.',
        '₹12 for a candy.',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<
      RegexIssue<string>,
      'input' | 'received' | 'requirement' | 'expected'
    > = {
      kind: 'validation',
      type: 'regex',
      message: 'message',
    };

    test('for invalid inputs of simple regex', () => {
      expectActionIssue(
        regex(/Valibot/u, 'message'),
        {
          ...baseIssue,
          expected: '/Valibot/u',
          requirement: /Valibot/u,
        },
        [
          'Validate unknown data with valibot.',
          'valibot is an open source schema library.',
          'Validate unknown data with valibot - an open source schema library',
        ]
      );
    });

    test('for invalid inputs of regex containing character classes', () => {
      expectActionIssue(
        // eslint-disable-next-line regexp/prefer-quantifier
        regex(/\b\d\d:\d\d/u, 'message'),
        {
          ...baseIssue,
          expected: '/\\b\\d\\d:\\d\\d/u',
          // eslint-disable-next-line regexp/prefer-quantifier
          requirement: /\b\d\d:\d\d/u,
        },
        [
          '23-59',
          '0.0:00!',
          'What is 5:37pm in the 24 hour-format?',
          'It is 17::37.',
          'Is x12:345 valid?',
        ]
      );
    });

    test('for invalid inputs of regexes containing anchors', () => {
      expectActionIssue(
        regex(/^\d\./mu, 'message'),
        {
          ...baseIssue,
          expected: '/^\\d\\./mu',
          requirement: /^\d\./mu,
        },
        [
          'Ordered list of fruits: \n1- Apple \n#2. Mango \n03. Banana',
          ' 1.1 An Introduction to TypeScript',
        ]
      );

      expectActionIssue(
        regex(/bot\.$/mu, 'message'),
        {
          ...baseIssue,
          expected: '/bot\\.$/mu',
          requirement: /bot\.$/mu,
        },
        ['Valibot. ', 'ValiBoT.', 'I am using Valibot!\n It is good library.']
      );

      expectActionIssue(
        regex(/^\d{2}:\d{2}$/mu, 'message'),
        {
          ...baseIssue,
          expected: '/^\\d{2}:\\d{2}$/mu',
          requirement: /^\d{2}:\d{2}$/mu,
        },
        ['00-00', '021:00\n 22:15\n23:300']
      );
    });

    test('for invalid inputs of regexes containing ranges & quantifiers', () => {
      expectActionIssue(
        regex(/#[a-f0-9]{6}/iu, 'message'),
        {
          ...baseIssue,
          expected: '/#[a-f0-9]{6}/iu',
          requirement: /#[a-f0-9]{6}/iu,
        },
        [
          '#00000g',
          '#XFFFFF',
          '#ffffyf',
          'Apples are FF0000 in color.',
          '#4B81Z7 HEX\n75, 129, 167 RGB\n205, 55%, 47% HSL',
        ]
      );

      expectActionIssue(
        regex(/[^aeiou]+/iu, 'message'),
        {
          ...baseIssue,
          expected: '/[^aeiou]+/iu',
          requirement: /[^aeiou]+/iu,
        },
        ['a', 'A', 'aa', 'ae', 'uioe', 'IoUeA', 'aeiou', 'AEIOU']
      );

      expectActionIssue(
        regex(/\w{3,}/u, 'message'),
        {
          ...baseIssue,
          expected: '/\\w{3,}/u',
          requirement: /\w{3,}/u,
        },
        ['hi', 'am', 'V', 'v', '12', '_', '1a']
      );

      expectActionIssue(
        regex(/\b\d{3,5}\b/u, 'message'),
        {
          ...baseIssue,
          expected: '/\\b\\d{3,5}\\b/u',
          requirement: /\b\d{3,5}\b/u,
        },
        [
          '3',
          '100000',
          'hi',
          'hello, mic test 1 2 3, check',
          'I have $113456',
          'x1234567 is also a very weak password.',
        ]
      );
    });

    test('for invalid inputs of regexes containing capturing groups', () => {
      expectActionIssue(
        regex(/(?:ha){2,}/iu, 'message'),
        {
          ...baseIssue,
          expected: '/(?:ha){2,}/iu',
          requirement: /(?:ha){2,}/iu,
        },
        [
          'ha',
          'hahbaha',
          "Haahaaha, that's hilarious!",
          'And then, bahaaha, the cat stole my sandwich!',
        ]
      );

      expectActionIssue(
        regex(/<(([a-z]+)\s([^>]*))>/iu, 'message'),
        {
          ...baseIssue,
          expected: '/<(([a-z]+)\\s([^>]*))>/iu',
          requirement: /<(([a-z]+)\s([^>]*))>/iu,
        },
        [
          '<a href = "https://valibot.dev/"',
          '<span>',
          'div >',
          'The <img> tag is used to add an image in an HTML page.',
          'Tag used to add an image in an HTML page? <img>',
        ]
      );

      expectActionIssue(
        regex(/(?<hr>\d{2})[:-](?<min>\d{2})/u, 'message'),
        {
          ...baseIssue,
          expected: '/(?<hr>\\d{2})[:-](?<min>\\d{2})/u',
          requirement: /(?<hr>\d{2})[:-](?<min>\d{2})/u,
        },
        [
          '23::55',
          '00.00',
          "It's 10: 00. I am late.",
          'I will reach home by 21 - 00',
        ]
      );
    });

    test('for invalid inputs of regexes containing backreferences', () => {
      expectActionIssue(
        regex(/(["'`])(['"`\w]+)\1/u, 'message'),
        {
          ...baseIssue,
          expected: '/(["\'`])([\'"`\\w]+)\\1/u',
          requirement: /(["'`])(['"`\w]+)\1/u,
        },
        [
          "Not a valid string: 'hello`",
          '\'hello" is not a valid string',
          'Even "hello\' is not a valid string',
        ]
      );

      expectActionIssue(
        regex(/(?<quote>["'`])(['"`\w]+)\k<quote>/u, 'message'),
        {
          ...baseIssue,
          expected: '/(?<quote>["\'`])([\'"`\\w]+)\\k<quote>/u',
          requirement: /(?<quote>["'`])(['"`\w]+)\k<quote>/u,
        },
        [
          "Not a valid string: 'hello`",
          '\'hello" is not a valid string',
          'Even "hello\' is not a valid string',
        ]
      );
    });

    test('for invalid inputs of regexes containing alternation', () => {
      expectActionIssue(
        regex(/\b(?:css|html|javascript)\b/iu, 'message'),
        {
          ...baseIssue,
          expected: '/\\b(?:css|html|javascript)\\b/iu',
          requirement: /\b(?:css|html|javascript)\b/iu,
        },
        [
          'HTML5',
          'CSS3',
          'JavaScriptt',
          'Build websites using HTML5, CSS3 and Java.',
        ]
      );
    });

    test('for invalid inputs of regexes containing lookahead or lookbehind', () => {
      expectActionIssue(
        regex(/\b\d(?=€)/u, 'message'),
        {
          ...baseIssue,
          expected: '/\\b\\d(?=€)/u',
          requirement: /\b\d(?=€)/u,
        },
        ['5£', '1 candy costs 1 €', '1 candy costs €1.', '10€ for a candy.']
      );

      expectActionIssue(
        regex(/(?<=₹)\d{2}/u, 'message'),
        {
          ...baseIssue,
          expected: '/(?<=₹)\\d{2}/u',
          requirement: /(?<=₹)\d{2}/u,
        },
        ['₹ 50', '1 candy costs 12₹', '1 candy costs ₹1.', '€12 for a candy.']
      );
    });
  });
});
