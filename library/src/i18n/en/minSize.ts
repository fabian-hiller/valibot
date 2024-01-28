import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'min_size',
  (issue) =>
    `Invalid size: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
