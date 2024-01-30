import { component$, Slot, useSignal } from '@builder.io/qwik';
import { DocSearch, Footer, Header, RoutingIndicator } from '~/components';

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
