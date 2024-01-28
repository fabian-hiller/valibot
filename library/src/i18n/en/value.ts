import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'value',
  (issue) =>
    `Invalid value: Expected ${issue.expected} but received ${issue.received}`,
  'en'
);
