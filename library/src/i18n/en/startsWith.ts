import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'starts_with',
  (issue) =>
    `Invalid start: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
