import type { RequestHandler } from '@builder.io/qwik-city';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import satori from 'satori';

let wasmPromise: Promise<void> | undefined;

async function getFontData(fileName: string) {
  const resposne = await fetch(
    `${import.meta.env.PUBLIC_WEBSITE_URL}/fonts/${fileName}`
  );
  return resposne.arrayBuffer();
}

export const onGet: RequestHandler = async ({ send, url }) => {
  // Get title and description from search params
  const title = url.searchParams.get('title');
  const description = url.searchParams.get('description') || 'valibot.dev';

  // Create Lexend 400 font object
  const lexend400 = {
    name: 'Lexend',
    data: await getFontData('lexend-400.ttf'),
    style: 'normal',
    weight: 400,
  } as const;

  // Create Lexend 500 font object
  const lexend500 = {
    name: 'Lexend',
    data: await getFontData('lexend-500.ttf'),
    style: 'normal',
    weight: 500,
  } as const;

  // Create Lexend Exa 500 font object
  const lexendExa500 = {
    name: 'Lexend Exa',
    data: await getFontData('lexend-exa-500.ttf'),
    style: 'normal',
    weight: 500,
  } as const;

  // Generate SVG string using Satori
  const svg = title
    ? // If title is available, return SVG with text
      await satori(
        {
          type: 'div',
          props: {
            tw: 'flex h-full w-full flex-col justify-between bg-gray-900 p-16',
            style: { fontFamily: 'Lexend' },
            children: [
              {
                type: 'div',
                props: {
                  tw: 'flex items-center',
                  children: [
                    {
                      type: 'img',
                      props: {
                        tw: 'w-16 h-16',
                        src: `${
                          import.meta.env.PUBLIC_WEBSITE_URL
                        }/icon-192px.png`,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        tw: 'text-4xl font-medium text-slate-300 ml-4',
                        style: { fontFamily: 'Lexend Exa' },
                        children: 'Valibot',
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  tw: 'flex flex-col',
                  children: [
                    {
                      type: 'h1',
                      props: {
                        tw: 'max-w-[80%] text-6xl font-medium leading-normal text-slate-200',
                        style: {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        },
                        children: title,
                      },
                    },
                    {
                      type: 'p',
                      props: {
                        tw: 'text-4xl text-slate-400 leading-loose',
                        children:
                          description.length > 110
                            ? description.slice(0, 110).trimEnd() + '...'
                            : description,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          width: 1200,
          height: 630,
          fonts: [lexend400, lexend500, lexendExa500],
        }
      )
    : // Otherwise, return SVG with logo
      await satori(
        {
          type: 'div',
          props: {
            tw: 'flex h-full w-full items-center justify-center bg-gray-900',
            style: { fontFamily: 'Lexend Exa' },
            children: {
              type: 'div',
              props: {
                tw: 'flex items-center',
                children: [
                  {
                    type: 'img',
                    props: {
                      tw: 'w-36 h-36',
                      src: `${
                        import.meta.env.PUBLIC_WEBSITE_URL
                      }/icon-192px.png`,
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      tw: 'text-8xl font-medium text-slate-300 ml-10',
                      children: 'Valibot',
                    },
                  },
                ],
              },
            },
          },
        },
        {
          width: 1200,
          height: 630,
          fonts: [lexendExa500],
        }
      );

  // Lazy initialize WebAssembly module
  if (!wasmPromise) {
    wasmPromise = initWasm(
      fetch('https://unpkg.com/@resvg/resvg-wasm/index_bg.wasm')
    );
  }
  await wasmPromise;

  // Convert SVG string to PNG image
  const image = new Resvg(svg).render().asPng();

  // Send PNG image as response
  send(new Response(image, { headers: { 'content-type': 'image/png' } }));
};
