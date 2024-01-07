import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Video url validation type.
 */
export type VideoUrlValidation<TInput extends string> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'videoUrl';
    /**
     * The validation function.
     */
    requirement: (input: string) => boolean;
  };

export type VideoService = 'youtube' | 'vimeo' | 'twitch';

export const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(w{3}\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:e(?:mbed)?|v)\/|.*[?&]v=)|youtu\.be\/)([^"&?/]{11})/u;

export const VIMEO_URL_REGEX =
  /^https?:\/\/(?:w{3}\.)?(?:player\.)?vimeo\.com\/(?:channels\/[A-Za-z]+\/|groups\/[A-Za-z]+\/videos\/)?\d+/u;

export const TWITCH_URL_REGEX =
  /^https?:\/\/((w{3}\.)?twitch\.tv\/videos\/\d+|clips\.twitch\.tv\/[a-zA-Z]+(-[a-zA-Z\d]+)*)$/u;

type VideoServiceList = Record<string, RegExp>;

/**
 * Video url regex list.
 */
const VIDEO_URL_REGEX_LIST: VideoServiceList = {
  youtube: YOUTUBE_URL_REGEX,
  vimeo: VIMEO_URL_REGEX,
  twitch: TWITCH_URL_REGEX,
};

/**
 * Creates a pipeline validation action that validates a [video url](https://en.wikipedia.org/wiki/List_of_online_video_platforms).
 *
 * @param service array of service names ['youtube', 'vimeo']
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function videoUrl<
  TInput extends string,
  TService extends VideoService[]
>(
  service: TService | [] = [],
  message: ErrorMessage = 'Invalid video url'
): VideoUrlValidation<TInput> {
  return {
    type: 'videoUrl',
    async: false,
    message,
    requirement: (input) => {
      const services =
        service && service.length > 0
          ? service
          : Object.keys(VIDEO_URL_REGEX_LIST);
      const requirements = services.map((srv) =>
        RegExp(VIDEO_URL_REGEX_LIST[srv as string]).test(input)
      );

      return requirements.includes(true);
    },
    _parse(input) {
      return !this.requirement(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
