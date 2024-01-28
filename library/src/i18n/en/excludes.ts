import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'excludes',
  (issue) =>
    `Invalid content: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
