import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'bytes',
  (issue) =>
    `Invalid bytes: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
