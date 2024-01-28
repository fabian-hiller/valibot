import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'regex',
  (issue) =>
    `Invalid format: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
