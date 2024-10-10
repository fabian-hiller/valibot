import { component$, Slot, useComputed$ } from '@builder.io/qwik';
import {
  type ContentMenu,
  useContent,
  useDocumentHead,
  useLocation,
} from '@builder.io/qwik-city';
import { ArrowLeftIcon, ArrowRightIcon, GitHubIcon, PenIcon } from '~/icons';
import '../styles/pace.css';
import { Credits } from './Credits';
import { IconButton } from './IconButton';
import { Navigation } from './Navigation';
import { SideBar, useSideBarToggle } from './SideBar';

type NavItem = ContentMenu & { group: string };

/**
 * Provides the layout for the documentation pages.
 */
export const DocsLayout = component$(() => {
  // Use location, content, docuemnt head and side bar toggle
  const location = useLocation();
  const content = useContent();
  const documentHead = useDocumentHead();
  const sideBarToggle = useSideBarToggle();

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

  return (
    <div class="flex w-full max-w-screen-xl flex-1 flex-col-reverse self-center lg:flex-row">
      {/* Side bar navigation */}
      <SideBar class="lg:max-h-[calc(100vh-70px)]" toggle={sideBarToggle}>
        <div q:slot="buttons" class="mr-4 flex space-x-6 lg:hidden">
          <NavButtons
            pageIndex={navIndex.value}
            sourcePath={documentHead.frontmatter.source}
            prevPage={prevPage.value}
            nextPage={nextPage.value}
          />
        </div>
        <Navigation />
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
        <article class="mdx flex flex-col">
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
        <Credits />
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
