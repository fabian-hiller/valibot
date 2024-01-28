import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'decimal',
  (issue) => `Invalid decimal: Received ${issue.received}`,
  'en'
);
