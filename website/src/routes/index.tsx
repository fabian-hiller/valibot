import { component$, useComputed$ } from '@builder.io/qwik';
import {
  type DocumentHead,
  Form,
  routeAction$,
  zod$,
  z,
} from '@builder.io/qwik-city';
import clsx from 'clsx';
import { ActionButton, ButtonGroup, Expandable, TextLink } from '~/components';
import { PlusIcon } from '~/icons';
import { blurredCodeDarkUrl, blurredCodeLightUrl } from '~/images';

export const head: DocumentHead = {
  title: 'Valibot: The modular and type safe schema library',
  meta: [
    {
      name: 'description',
      content:
        'Validate unknown data with Valibot, the open source schema library with bundle size, type safety and developer experience in mind.',
    },
  ],
};

/**
 * Toggles the index of the FAQ.
 */
export const useFaqToggle = routeAction$(
  (values) => values,
  zod$({ index: z.coerce.number() })
);

export default component$(() => {
  // Use FAQ toggle and compute its index
  const faqToggle = useFaqToggle();
  const faqIndex = useComputed$(() => faqToggle.value?.index || 0);

  return (
    <main class="flex flex-1 flex-col items-center space-y-24 py-24 md:space-y-36 md:py-36 xl:space-y-52 xl:py-52">
      {/* Pitch */}
      <section class="space-y-8 px-4 text-center md:max-w-4xl md:space-y-12 lg:space-y-16">
        <div class="absolute left-0 top-0 -z-10 flex w-full justify-center overflow-x-clip">
          <div class="relative w-full xl:w-0">
            <div class="absolute -right-[300px] -top-[250px] h-[600px] w-[600px] bg-[radial-gradient(theme(colors.yellow.500/.08),transparent_70%)] dark:bg-[radial-gradient(theme(colors.yellow.300/.08),transparent_70%)] md:-right-[500px] md:-top-[500px] md:h-[1000px] md:w-[1000px] xl:-right-[1100px] xl:-top-[500px]" />
            <div class="absolute -left-[370px] top-[200px] h-[600px] w-[600px] bg-[radial-gradient(theme(colors.sky.600/.08),transparent_70%)] dark:bg-[radial-gradient(theme(colors.sky.400/.08),transparent_70%)] md:-left-[550px] md:top-[100px] md:h-[1000px] md:w-[1000px] lg:top-[200px] xl:-left-[1100px] xl:top-[300px]" />
          </div>
        </div>
        <h1 class="font-lexend-exa text-xl font-semibold text-slate-900 dark:text-slate-200 md:text-3xl lg:text-4xl xl:text-5xl">
          Validate with Valibot
        </h1>
        <p class="text-center leading-loose md:text-xl md:leading-loose xl:text-2xl xl:leading-loose">
          Validate unknown data with Valibot, the open source schema library
          with bundle size, type safety and developer experience in mind.
        </p>
        <ButtonGroup class="justify-center">
          <ActionButton
            variant="primary"
            label="Get started"
            type="link"
            href="/guides"
          />
          <ActionButton
            variant="secondary"
            label="API reference"
            type="link"
            href="/api"
          />
        </ButtonGroup>
      </section>

      {/* Video */}
      <section class="w-full px-3 md:max-w-5xl xl:max-w-[1360px] xl:px-10">
        <div class="relative z-0 flex aspect-video w-full items-center justify-center overflow-hidden rounded-3xl border-[3px] border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-900 md:border-4 lg:rounded-[32px]">
          {[
            { theme: 'dark', url: blurredCodeDarkUrl },
            { theme: 'light', url: blurredCodeLightUrl },
          ].map(({ theme, url }) => (
            // eslint-disable-next-line qwik/jsx-img
            <img
              key={url}
              class={clsx(
                'absolute -z-10 h-full w-full object-cover object-left',
                theme === 'dark' ? 'hidden dark:block' : 'dark:hidden'
              )}
              src={url}
              alt="Blurred TypeScript code"
            />
          ))}
          <p class="px-8 text-center leading-loose md:text-lg md:leading-loose lg:text-xl lg:leading-loose">
            There will probably be a video at this point in the future
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section class="lg:max-w-6xl">
        <h2 class="px-4 text-center text-xl font-medium text-slate-900 dark:text-slate-200 md:text-2xl lg:text-3xl xl:text-4xl">
          Highlights you should not miss
        </h2>
        <ul class="mt-16 flex flex-wrap justify-center gap-16 px-8 md:mt-20 lg:mt-32 xl:mt-36 xl:gap-24">
          {[
            {
              emoji: '🔒',
              heading: 'Fully type safe',
              text: 'Enjoy the benefits of type safety and static type inference in TypeScript',
            },
            {
              emoji: '📦',
              heading: 'Small bundle size',
              text: 'Due to the modular design of our API the bundle size starts at less than 300 bytes',
            },
            {
              emoji: '🚧',
              heading: 'Validate everything',
              text: 'Supports almost any TypeScript type from primitive values to complex objects',
            },
            {
              emoji: '🛟',
              heading: '100% test coverage',
              text: "Valibot's source code is open source and fully tested with 100% coverage",
            },
            {
              emoji: '🔋',
              heading: 'Helpers included',
              text: 'Important validation and transformation helpers are already included',
            },
            {
              emoji: '🧑‍💻',
              heading: 'API with great DX',
              text: 'Minimal, readable and well thought out API for a great developer experience',
            },
          ].map(({ emoji, heading, text }) => (
            <li
              key={emoji}
              class="flex flex-col items-center space-y-6 text-center md:space-y-7 lg:max-w-[45%] lg:flex-row lg:items-start lg:space-x-8 lg:space-y-0 lg:text-left"
            >
              <div class="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-sky-600/10 text-2xl dark:bg-sky-400/5">
                {emoji}
              </div>
              <div class="max-w-[370px] space-y-4 md:space-y-5">
                <h3 class="text-lg font-medium text-slate-900 dark:text-slate-200 md:text-xl">
                  {heading}
                </h3>
                <p class="leading-loose md:text-lg md:leading-loose">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section class="space-y-14 md:max-w-4xl md:space-y-20 lg:space-y-32">
        <h2 class="px-4 text-center text-xl font-medium text-slate-900 dark:text-slate-200 md:text-2xl lg:text-3xl xl:text-4xl">
          Frequently asked questions
        </h2>
        <ul class="space-y-12 md:space-y-14 lg:space-y-16">
          {[
            {
              heading: 'Where can I enter my credit card?',
              Text: () => (
                <>
                  You don't have to! Valibot is available free of charge and
                  licensed under the{' '}
                  <TextLink
                    href={`${
                      import.meta.env.PUBLIC_GITHUB_URL
                    }/tree/main/LICENSE.md`}
                    target="_blank"
                    underlined
                    colored
                  >
                    MIT License
                  </TextLink>
                  . We finance the development from our own funds. If your
                  company would like to support us, you can take a look at our
                  sponsor page on{' '}
                  <TextLink
                    href="https://github.com/sponsors/fabian-hiller"
                    target="_blank"
                    underlined
                    colored
                  >
                    GitHub
                  </TextLink>
                  .
                </>
              ),
            },
            {
              heading: 'What exactly does Valibot do?',
              Text: () => (
                <>
                  The core function of Valibot is to create a schema. A schema
                  can be compared to a type definition in TypeScript. The big
                  difference is that TypeScript types are “not executed” and are
                  more or less a DX feature. A schema on the other hand, apart
                  from the inferred type definition, can also be executed at
                  runtime to guarantee type safety of unknown data.
                </>
              ),
            },
            {
              heading: 'How does a modular design reduce bundle size?',
              Text: () => (
                <>
                  Due to the modular design of our API, a bundler can use the
                  import statements to remove the code you don't need. This way,
                  only the code that is actually used ends up in your production
                  build. This also allows us to add new functionality to Valibot
                  without increasing the size for all users.
                </>
              ),
            },
            {
              heading: 'How is it different from Zod?',
              Text: () => (
                <>
                  The functionality of Valibot is very similar to Zod. The
                  biggest difference is the modular design of our API and the
                  ability to reduce the bundle size to a minimum through code
                  splitting. Depending on the schema, Valibot can reduce the
                  bundle size up to 98% compared to Zod. Especially for
                  client-side validation of forms, this can be a big advantage.
                </>
              ),
            },
          ].map(({ heading, Text }, index) => {
            const isOpen = index === faqIndex.value;
            return (
              <li key="heading" class="flex flex-col px-8">
                <Form action={faqToggle}>
                  <input type="hidden" name="index" value={index} />
                  <button
                    class={clsx(
                      'focus-ring flex w-full justify-between space-x-4 rounded-md transition-colors focus-visible:outline-offset-[6px] focus-visible:ring-offset-8',
                      isOpen
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'text-slate-800 hover:text-slate-700 dark:text-slate-300 hover:dark:text-slate-400'
                    )}
                    type="submit"
                    disabled={isOpen}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${index}`}
                  >
                    <h3 class="text-left font-medium leading-relaxed md:text-xl lg:text-2xl">
                      {heading}
                    </h3>
                    <PlusIcon
                      class={clsx(
                        'mt-1.5 h-4 flex-shrink-0 transition-transform lg:h-5',
                        isOpen && 'rotate-45'
                      )}
                      stroke-width={6}
                    />
                  </button>
                </Form>
                <Expandable
                  id={`faq-${index}`}
                  class="overflow-hidden"
                  expanded={isOpen}
                >
                  <p class="pt-6 leading-loose md:pt-7 md:text-lg md:leading-loose lg:pt-8 lg:text-xl lg:leading-loose">
                    <Text />
                  </p>
                </Expandable>
              </li>
            );
          })}
        </ul>
      </section>

      {/* CTA */}
      <ButtonGroup class="justify-center">
        <ActionButton
          variant="primary"
          label="Get started"
          type="link"
          href="/guides"
        />
        <ActionButton
          variant="secondary"
          label="API reference"
          type="link"
          href="/api"
        />
      </ButtonGroup>
    </main>
  );
});
