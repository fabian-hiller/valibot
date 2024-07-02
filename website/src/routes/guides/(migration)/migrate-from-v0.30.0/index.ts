import type { RequestEvent } from '@builder.io/qwik-city';

export const onGet = async ({ redirect }: RequestEvent) => {
  throw redirect(301, '/guides/migrate-to-v0.31.0/');
};
