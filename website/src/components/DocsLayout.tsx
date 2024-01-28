import { component$, Slot, useComputed$ } from '@builder.io/qwik';
import {
  type ContentMenu,
  useContent,
  useDocumentHead,
  useLocation,
} from '@builder.io/qwik-city';
import { ArrowLeftIcon, ArrowRightIcon, GitHubIcon, PenIcon } from '~/icons';
import { AlgoliaLogo, BuilderLogo, NetlifyLogo, PaceLogo } from '~/logos';
import '../styles/pace.css';
import { IconButton } from './IconButton';
import { Navigation } from './Navigation';
import { SideBar } from './SideBar';

type NavItem = ContentMenu & { group: string };

/**
 * Provides the layout for the documentation pages.
 */
export const DocsLayout = component$(() => {
  // Use location, content and docuemnt head
  const location = useLocation();
  const content = useContent();
  const documentHead = useDocumentHead();

  // Compute navigation items
  const navItems = useComputed$(
    () =>
      content.menu?.items?.reduce<NavItem[]>(
        (list, { text, items }) =>
          items
            ? [...list, ...items.map((item) => ({ ...item, group: text }))]
            : list,
        []
      ) || []
  );

  // Compute current navigation index
  const navIndex = useComputed$(() =>
    navItems.value.findIndex((item) => item.href === location.url.pathname)
  );

  // Compute previous, current and next page
  const prevPage = useComputed$<NavItem | undefined>(
    () => navItems.value[navIndex.value - 1]
  );
  const currentPage = useComputed$<NavItem | undefined>(
    () => navItems.value[navIndex.value]
  );
  const nextPage = useComputed$<NavItem | undefined>(
    () => navItems.value[navIndex.value + 1]
  );

  // Compute contributors
  const contributors = useComputed$<string[]>(
    () => documentHead.frontmatter.contributors || []
  );

  return (
    <div class="flex w-full max-w-screen-xl flex-1 flex-col-reverse self-center lg:flex-row">
      {/* Side bar navigation */}
      <SideBar>
        <div q:slot="buttons" class="mr-4 flex space-x-6 lg:hidden">
          <NavButtons
            pageIndex={navIndex.value}
            sourcePath={documentHead.frontmatter.source}
            prevPage={prevPage.value}
            nextPage={nextPage.value}
          />
        </div>
        <div class="space-y-9 lg:space-y-12">
          <Navigation />
        </div>
      </SideBar>

      <main class="relative flex-1 py-12 md:py-20 lg:w-px lg:py-32 lg:pl-9">
        {/* Navigation buttons */}
        <nav class="hidden px-8 lg:absolute lg:right-0 lg:flex lg:space-x-6 lg:px-10">
          <NavButtons
            pageIndex={navIndex.value}
            sourcePath={documentHead.frontmatter.source}
            prevPage={prevPage.value}
            nextPage={nextPage.value}
          />
        </nav>

        {/* Article */}
        <article class="mdx">
          <Slot />
        </article>

        {currentPage.value?.href && (
          <nav class="mt-10 flex justify-between px-8 md:mt-12 lg:mt-14 lg:px-10">
            {/* Edit page buttton */}
            <IconButton
              variant="secondary"
              type="link"
              href={`https://github.com/fabian-hiller/valibot/blob/main/website/src/routes${currentPage.value.href.replace(
                /^(\/.+)\/(.+\/)$/,
                `$1/(${currentPage.value.group
                  .toLowerCase()
                  .replace(/\s/g, '-')})/$2`
              )}index.mdx`}
              target="_blank"
              label="Edit page"
            >
              <PenIcon class="h-[18px]" />
            </IconButton>

            {/* Next page button */}
            {nextPage.value?.href && (
              <div class="hidden lg:block">
                <IconButton
                  variant="secondary"
                  type="link"
                  href={nextPage.value.href}
                  label="Next page"
                  align="right"
                >
                  <ArrowRightIcon class="h-[18px]" />
                </IconButton>
              </div>
            )}
          </nav>
        )}

        {/* Credits */}
        <footer class="mx-8 mt-12 border-t-2 pt-2 dark:border-slate-800 md:mt-16 md:pt-4 lg:mx-10 lg:mt-20 lg:pt-6">
          {contributors.value.length > 0 && (
            <>
              <h3 class="mt-10 text-lg font-medium text-slate-900 dark:text-slate-200 md:mt-12 md:text-xl lg:mt-14 lg:text-2xl">
                Contributors
              </h3>
              <p class="mt-3 leading-loose md:mt-4 md:text-lg md:leading-loose lg:mt-5 lg:text-xl lg:leading-loose">
                Thanks to all the contributors who helped make this page better!
              </p>
              <ul class="mt-4 flex flex-wrap gap-2 md:mt-5 lg:mt-6 lg:gap-3">
                {contributors.value.map((contributor) => (
                  <li key={contributor}>
                    <a
                      href={`https://github.com/${contributor}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        loading="lazy"
                        src={`https://github.com/${contributor}.png?size=88`}
                        alt={`GitHub profile picture of ${contributor}`}
                        class="w-9 rounded-full md:w-10 lg:w-11"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h3 class="mt-10 text-lg font-medium text-slate-900 dark:text-slate-200 md:mt-12 md:text-xl lg:mt-14 lg:text-2xl">
            Partners
          </h3>
          <p class="mt-3 leading-loose md:mt-4 md:text-lg md:leading-loose lg:mt-5 lg:text-xl lg:leading-loose">
            Thanks to our partners who support the project ideally and
            financially.
          </p>
          <ul class="mt-4 flex flex-wrap gap-x-6 gap-y-3 md:mt-5 md:gap-x-8 md:gap-y-4 lg:mt-6 lg:gap-x-10 lg:gap-y-5">
            {[
              { Logo: PaceLogo, href: 'https://www.pace.edu' },
              { Logo: BuilderLogo, href: 'https://www.builder.io' },
              { Logo: NetlifyLogo, href: 'https://www.netlify.com' },
              { Logo: AlgoliaLogo, href: 'https://www.algolia.com' },
            ].map(({ Logo, href }) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noreferrer">
                  <Logo class="h-9 md:h-11 lg:h-12" />
                </a>
              </li>
            ))}
          </ul>

          <h3 class="mt-10 text-lg font-medium text-slate-900 dark:text-slate-200 md:mt-12 md:text-xl lg:mt-14 lg:text-2xl">
            Sponsors
          </h3>
          <p class="mt-3 leading-loose md:mt-4 md:text-lg md:leading-loose lg:mt-5 lg:text-xl lg:leading-loose">
            Thanks to our GitHub sponsors who support the project financially.
          </p>
          <ul class="mt-4 flex flex-wrap gap-2 md:mt-5 lg:mt-6 lg:gap-3">
            {[
              'dailydotdev',
              'ivan-mihalic',
              'KATT',
              'osdiab',
              'richardvanbergen',
              'Thanaen',
              'hyunbinseo',
              'armandsalle',
              'caegdeveloper',
            ].map((sponsor) => (
              <li key={sponsor}>
                <a
                  href={`https://github.com/${sponsor}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    loading="lazy"
                    src={`https://github.com/${sponsor}.png?size=88`}
                    alt={`GitHub profile picture of ${sponsor}`}
                    class="w-9 rounded-full md:w-10 lg:w-11"
                  />
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </main>
    </div>
  );
});

type NavButtonsProps = {
  pageIndex: number;
  sourcePath: string | undefined;
  prevPage: ContentMenu | undefined;
  nextPage: ContentMenu | undefined;
};

/**
 * Buttons to navigate to the previous or next page.
 */
export const NavButtons = component$<NavButtonsProps>(
  ({ pageIndex, sourcePath, prevPage, nextPage }) => (
    <>
      {pageIndex !== -1 && (
        <>
          {prevPage?.href ? (
            <IconButton
              variant="secondary"
              type="link"
              href={prevPage.href}
              label="Previous page"
              hideLabel
            >
              <ArrowLeftIcon class="h-[18px]" />
            </IconButton>
          ) : (
            <div class="w-10" />
          )}
          {nextPage?.href ? (
            <IconButton
              variant="secondary"
              type="link"
              href={nextPage.href}
              label="Next page"
              hideLabel
            >
              <ArrowRightIcon class="h-[18px]" />
            </IconButton>
          ) : (
            <div class="w-10" />
          )}
          {sourcePath && (
            <IconButton
              variant="secondary"
              type="link"
              href={`https://github.com/fabian-hiller/valibot/blob/main/library/src${sourcePath}`}
              target="_blank"
              label="Source code"
              hideLabel
            >
              <GitHubIcon class="h-[18px]" />
            </IconButton>
          )}
        </>
      )}
    </>
  )
);
