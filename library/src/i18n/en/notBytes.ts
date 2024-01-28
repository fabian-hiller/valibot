import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'not_bytes',
  (issue) =>
    `Invalid bytes: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
