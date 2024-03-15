import { component$ } from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city';
import { Head } from './components';
import './styles/root.css';
import { disableTransitions } from './utils';

export default component$(() => (
  <QwikCityProvider>
    <Head />
    <body
      class="font-lexend flex min-h-screen flex-col bg-white text-slate-600 dark:bg-gray-900 dark:text-slate-400"
      window:onResize$={() => disableTransitions()}
    >
      <RouterOutlet />
      <ServiceWorkerRegister />
    </body>
  </QwikCityProvider>
));
