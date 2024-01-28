import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'max_value',
  (issue) =>
    `Invalid value: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
