import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'url',
  (issue) => `Invalid URL: Received ${issue.received}`,
  'en'
);
