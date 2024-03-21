import { describe, expect, test } from 'vitest';
import { videoUrl } from './videoUrl.ts';

describe('videoUrl', () => {
  test('should pass only valid values', () => {
    const validate = videoUrl();

    const value = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    expect(validate._parse(value).output).toBe(value);

    const value2 = 'https://youtu.be/dQw4w9WgXcQ';
    expect(validate._parse(value2).output).toBe(value2);

    const value3 = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    expect(validate._parse(value3).output).toBe(value3);

    const value4 = 'https://www.vimeo.com/262351620';
    expect(validate._parse(value4).output).toBe(value4);

    const value5 = 'https://vimeo.com/262351620';
    expect(validate._parse(value5).output).toBe(value5);

    const value6 = 'https://www.vimeo.com/groups/name/videos/262351620';
    expect(validate._parse(value6).output).toBe(value6);

    const value7 = 'https://www.twitch.tv/videos/123456789';
    expect(validate._parse(value7).output).toBe(value7);

    const value8 =
      'https://clips.twitch.tv/AverageInterestingMageKeyboardCat-mJXyaIeaN641CbY8';
    expect(validate._parse(value8).output).toBe(value8);

    const value9 = 'https://twitch.tv/videos/123456789';
    expect(validate._parse(value9).output).toBe(value9);

    const value10 = 'https://twitch.tv/videos/123456789';
    expect(validate._parse(value10).output).toBe(value10);
  });

  test('should reject invalid values', () => {
    const validate = videoUrl();

    expect(
      validate._parse('https://www.youtub.com/watch?v=dQw4w9WgXcQ').issues
    ).toBeTruthy();
    expect(
      validate._parse('https://www.youtube.com/watch?v=').issues
    ).toBeTruthy();
    expect(
      validate._parse('https://www.youtube.com/video/dQw4w9WgXcQ').issues
    ).toBeTruthy();
    expect(
      validate._parse('https://www.vime.com/123456789').issues
    ).toBeTruthy();
    expect(validate._parse('https://www.vimeo.com/').issues).toBeTruthy();
    expect(
      validate._parse('https://www.vimeo.com/video/123456789').issues
    ).toBeTruthy();
    expect(
      validate._parse('https://www.twich.tv/videos/123456789').issues
    ).toBeTruthy();
    expect(
      validate._parse('https://www.twitch.tv/videos/').issues
    ).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not a valid video url!';
    const validate = videoUrl(['youtube'], error);
    expect(validate._parse('').issues?.[0].message).toBe(error);
  });
});
