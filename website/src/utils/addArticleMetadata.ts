import type {
  DocumentHeadProps,
  DocumentHeadValue,
} from '@builder.io/qwik-city';

/**
 * Adds Open Graph and Twitter metadata to the document head.
 *
 * @param props The current head properties.
 *
 * @returns Open Graph and Twitter metadata.
 */
export function addArticleMetadata({
  url,
  head,
}: DocumentHeadProps): DocumentHeadValue {
  // Get description from metadata
  const description =
    head.meta.find((item) => item.name === 'description')?.content || '';

  // Create Open Graph image URL
  const imageUrl = `${url.origin}/og-image?title=${encodeURIComponent(
    head.title
  )}&description=${encodeURIComponent(description)}&path=${
    url.pathname.split('/')[1]
  }`;

  // Return Open Graph and Twitter metadata
  return {
    meta: [
      // Open Graph
      {
        property: 'og:type',
        content: 'article',
      },
      {
        property: 'og:url',
        content: url.href,
      },
      {
        property: 'og:title',
        content: head.title,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:image',
        content: imageUrl,
      },

      // Twitter
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: head.title,
      },
      {
        name: 'twitter:description',
        content: description,
      },
      {
        name: 'twitter:image',
        content: imageUrl,
      },
    ],
  };
}
