import { component$, Slot } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { Footer, Header, RoutingIndicator } from '~/components';

export default component$(() => (
  <>
    <RoutingIndicator />
    <Header />
    <Slot />
    <Footer />
  </>
));

export const head: DocumentHead = (request) => ({
  // Add name of site to title of subpages
  title:
    request.url.pathname === '/'
      ? request.head.title
      : `${request.head.title} | Valibot`,
});
