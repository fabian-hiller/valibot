import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'max_size',
  (issue) =>
    `Invalid size: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
