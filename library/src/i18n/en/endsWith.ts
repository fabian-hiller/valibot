import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'ends_with',
  (issue) =>
    `Invalid end: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
