import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'bic',
  (issue) => `Invalid BIC: Received ${issue.received}`,
  'en'
);
