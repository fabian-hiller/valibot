import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';
import { useTheme } from '~/routes/plugin@theme';

/**
 * Head with title, meta, link, script and style elements.
 */
export const Head = component$(() => {
  const head = useDocumentHead();
  const location = useLocation();
  const theme = useTheme();

  return (
    <head>
      <title>{head.title}</title>

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="theme-color"
        content={theme.value === 'dark' ? '#111827' : '#fff'}
      />

      <link rel="canonical" href={location.url.href} />
      <link rel="icon" type="image/png" sizes="32x32" href="/icon-32px.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icon-16px.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icon-180px.jpg" />
      <link rel="manifest" href="/manifest.json" />

      <script
        async
        src="https://umami.valibot.dev/script.js"
        data-website-id="1fe7c3d9-66cb-43db-bb9c-dd86128e828c"
        data-domains="valibot.dev"
      />

      {/* Temporary solution until attribute can be rendered dynamically */}
      {theme.value === 'dark' ? (
        <script dangerouslySetInnerHTML="document.documentElement.classList.add('dark')" />
      ) : (
        <script dangerouslySetInnerHTML="document.documentElement.classList.remove('dark')" />
      )}

      {[...head.meta, ...(head.frontmatter.meta || [])].map(
        ({ key, ...props }) => (
          <meta key={key} {...props} />
        )
      )}

      {/* TODO: Check if we really need this code */}
      {head.links.map(({ key, ...props }) => (
        <link key={key} {...props} />
      ))}

      {/* TODO: Check if we really need this code */}
      {head.styles.map(({ key, style, ...props }) => (
        <style key={key} {...props} dangerouslySetInnerHTML={style} />
      ))}
    </head>
  );
});
