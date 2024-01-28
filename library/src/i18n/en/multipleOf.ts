import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'multiple_of',
  (issue) =>
    `Invalid multiple: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
