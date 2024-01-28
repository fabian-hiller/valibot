import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'min_bytes',
  (issue) =>
    `Invalid bytes: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
