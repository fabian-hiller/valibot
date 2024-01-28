import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'credit_card',
  (issue) => `Invalid credit card: Received ${issue.received}`,
  'en'
);
