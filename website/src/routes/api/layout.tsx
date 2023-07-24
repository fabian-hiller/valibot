import { component$, Slot } from '@builder.io/qwik';
import { DocsLayout } from '~/components';

export default component$(() => (
  <DocsLayout>
    <Slot />
  </DocsLayout>
));
