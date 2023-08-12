export * from './executePipe/index.ts';
export * from './getCurrentPath/index.ts';
export * from './getErrorAndPipe/index.ts';
export * from './getPipeInfo/index.ts';
export * from './isLuhnAlgo/index.ts';

import { ParseInfo, PathItem } from '../types.ts';

export function getParseInfoWithPath(info: ParseInfo | undefined, path: PathItem[]): ParseInfo {
  return {
    origin: info?.origin,
    abortEarly: info?.abortEarly,
    abortPipeEarly: info?.abortPipeEarly,
    path,
  }
}
