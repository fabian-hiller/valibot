import { component$, Slot, useSignal } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { DocSearch, Footer, Header, RoutingIndicator } from '~/components';

export const head: DocumentHead = (request) => ({
  // Add name of site to title of subpages
  title:
    request.url.pathname === '/'
      ? request.head.title
      : `${request.head.title} | Valibot`,
});

export default component$(() => {
  // Use search open signal
  const searchOpen = useSignal(false);

  return (
    <>
      <RoutingIndicator />
      <Header searchOpen={searchOpen} />
      <Slot />
      <Footer />
      <DocSearch open={searchOpen} />
    </>
  );
});
