import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'size',
  (issue) =>
    `Invalid size: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
