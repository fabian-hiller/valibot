import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'not_size',
  (issue) =>
    `Invalid size: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
