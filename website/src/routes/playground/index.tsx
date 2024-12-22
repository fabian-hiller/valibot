import {
  $,
  component$,
  type NoSerialize,
  type QRL,
  type Signal,
  sync$,
  useComputed$,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import {
  type DocumentHead,
  useLocation,
  useNavigate,
} from '@builder.io/qwik-city';
import clsx from 'clsx';
import lz from 'lz-string';
import type * as monaco from 'monaco-editor';
import { transform } from 'sucrase';
import {
  CodeEditor,
  IconButton,
  SideBar,
  useSideBarToggle,
} from '~/components';
import { useResetSignal } from '~/hooks';
import { BinIcon, CheckIcon, CopyIcon, PlayIcon, ShareIcon } from '~/icons';
import { trackEvent } from '~/utils';
import valibotCode from '../../../../library/dist/index.min.js?url';

type LogLevel = 'log' | 'info' | 'debug' | 'warn' | 'error';

type MessageEventData = {
  type: 'log';
  log: [LogLevel, string];
};

export const head: DocumentHead = {
  title: 'Playground',
  meta: [
    {
      name: 'description',
      content:
        "Write, test, and share your Valibot schemas instantly. Unleash your creativity with Valibot's online code editor.",
    },
  ],
};

export default component$(() => {
  // Use navigate, location and side bar toggle
  const navigate = useNavigate();
  const location = useLocation();
  const toggle = useSideBarToggle();

  // Use model, code and logs signals
  const model = useSignal<NoSerialize<monaco.editor.ITextModel>>();
  const code = useSignal<string>('');
  const logs = useSignal<[LogLevel, string][]>([]);

  // Use logs and last log element signals
  const logsElement = useSignal<HTMLOListElement>();
  const lastLogElement = useSignal<Element | null>();

  // Computed initial code of editor
  const initialCode = useComputed$(() => {
    const code = location.url.searchParams.get('code');
    return code
      ? lz.decompressFromEncodedURIComponent(code)
      : `import * as v from 'valibot';

const Schema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

const result = v.safeParse(Schema, {
  email: 'jane@example.com',
  password: '12345678',
});

console.log(result);`;
  });

  /**
   * Saves the current code of the editor.
   */
  const saveCode = $(async () => {
    // Add compressed code to search params
    await navigate(
      `?code=${lz.compressToEncodedURIComponent(model.value!.getValue())}`,
      { replaceState: true }
    );

    // Track playground event
    trackEvent('save_playground_code');
  });

  /**
   * Executes the current code of the editor.
   */
  const executeCode = $(() => {
    // Open side bar on smaller devices if it's closed
    if (
      window.innerWidth < 1024 &&
      (!toggle.value || toggle.value.state === 'closed')
    ) {
      toggle.submit({ state: 'opened' });
    }

    // Update code of iframe
    try {
      code.value = `// ${Date.now()}\n\n${
        transform(model.value!.getValue(), {
          transforms: ['typescript'],
        }).code
      }`;

      // Handle transform errors
    } catch (error) {
      logs.value = [
        ...logs.value,
        ['error', 'TypeScript syntax error detected'],
      ];
    }

    // Track playground event
    trackEvent('execute_playground_code');
  });

  /**
   * Captures logs from the iframe.
   */
  const captureLogs = $((event: MessageEvent<MessageEventData>) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (event.data.type === 'log') {
      logs.value = [...logs.value, event.data.log];
    }
  });

  /**
   * Clears the logs of the playground.
   */
  const clearLogs = $(() => {
    // Reset logs signal
    logs.value = [];

    // Track playground event
    trackEvent('clear_playground_logs');
  });

  /**
   * Handles keyboard keydown events.
   */
  const handleKeyDown = $((event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'Enter') {
        executeCode();
      } else if (event.key === 'Backspace') {
        clearLogs();
      }
    }
  });

  /**
   * Prevents default behavior of keydown events.
   */
  const preventDefault = sync$((event: KeyboardEvent) => {
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === 'Enter' || event.key === 'Backspace')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  // Scroll newest logs into view
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => logs.value);
    lastLogElement.value?.nextElementSibling?.scrollIntoView();
    lastLogElement.value = logsElement.value?.lastElementChild;
  });

  return (
    <main
      class="flex w-full flex-1 flex-col lg:flex-row lg:space-x-10 lg:px-10 lg:py-20 2xl:max-w-[1700px] 2xl:space-x-14 2xl:self-center"
      window:onMessage$={captureLogs}
      window:onKeyDown$={[preventDefault, handleKeyDown]}
    >
      <div class="flex flex-1 lg:relative">
        <CodeEditor value={initialCode} model={model} onSave$={saveCode} />
        <EditorButtons
          class="!hidden lg:!absolute lg:right-10 lg:top-10 lg:!flex"
          model={model}
          executeCode$={executeCode}
        />
      </div>

      <SideBar class="lg:w-80 xl:w-96 2xl:w-[500px]" toggle={toggle}>
        <EditorButtons
          q:slot="buttons"
          class="mr-4 lg:hidden"
          model={model}
          executeCode$={executeCode}
        />
        <IconButton
          class="!absolute right-8 top-8 z-10 lg:right-10 lg:top-10"
          type="button"
          variant="secondary"
          label="Clear logs"
          hideLabel
          onClick$={clearLogs}
        >
          <BinIcon class="h-[18px]" />
        </IconButton>
        <ol
          ref={logsElement}
          class="flex h-full flex-col items-start overflow-auto overscroll-contain scroll-smooth px-8 py-9 lg:absolute lg:w-full lg:rounded-3xl lg:border-[3px] lg:border-slate-200 lg:p-10 lg:dark:border-slate-800"
        >
          {logs.value.map(([level, message], index) => (
            <li key={index} class="scroll-mx-8 scroll-my-9 lg:scroll-m-10">
              <pre class="lg:text-lg">
                [
                <span
                  class={clsx(
                    'font-medium uppercase',
                    level === 'error'
                      ? 'text-red-600 dark:text-red-400'
                      : level === 'warn'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-sky-600 dark:text-sky-400'
                  )}
                >
                  {level}
                </span>
                ]: <span dangerouslySetInnerHTML={message} />
              </pre>
            </li>
          ))}
        </ol>
      </SideBar>

      {code.value && (
        <iframe
          hidden
          sandbox="allow-scripts"
          srcdoc={`
<!DOCTYPE html>
<html>
  <head>
    <script type="importmap">
      { "imports": { "valibot": "${valibotCode}" } }
    </script>
    <script type="module">
      // Create list of JSON tokens
      const jsonTokens = [
        ['whitespace', /^\\s+/],
        ['brace', /^[{}]/],
        ['bracket', /^[[\\]]/],
        ['colon', /^:/],
        ['comma', /^,/],
        ['key', /^"(?:\\\\.|[^"\\\\])*"(?=:)/],
        ['undefined', /^"\\[undefined\\]"/],
        ['instance', /^"\\[[A-Z]\\w*\\]"/],
        ['string', /^"(?:\\\\.|[^"\\\\])*"/],
        ['number', /^-?\\d+(?:\\.\\d+)?(?:e[+-]?\\d+)?/i],
        ['boolean', /^true|^false/],
        ['null', /^null/],
        ['unknown', /^.+/],
      ];
      
      /**
       * Stringify, prettify and colorize log arguments.
       *
       * @param args The log arguments.
       *
       * @returns The stringified output.
       */
      function stringify(args) {
        return args
          .map((arg) => {
            // If argument is an error, stringify it
            if (arg instanceof Error) {
              return arg.stack ?? \`$\{arg.name}: $\{arg.message}\`;
            }
      
            // Otherwise, convert argument to JSON string
            let jsonString = JSON.stringify(
              arg,
              (_, value) => {
                // Get type of value
                const type = typeof value;
      
                // If it is a bigint, convert it to a number
                if (type === 'bigint') {
                  return Number(value);
                }
      
                // If it is a non supported object, convert it to its constructor name
                if (value && (type === 'object' || type === 'function')) {
                  const name = Object.getPrototypeOf(value).constructor.name;
                  if (name !== 'Object' && name !== 'Array') {
                    return \`[$\{name}]\`;
                  }
                }

                // If it is undefined, convert it to a string
                if (value === undefined) {
                  return '[undefined]';
                }
      
                // Otherwise, return value as is
                return value;
              },
              2
            );
      
            // Transform and colorize specific JSON tokens
            const output = [];
            while (jsonString) {
              for (const [token, regex] of jsonTokens) {
                const match = regex.exec(jsonString);
                if (match) {
                  const substring = match[0];
                  jsonString = jsonString.substring(substring.length);
                  if (token === 'key') {
                    output.push(
                      \`<span class="text-slate-700 dark:text-slate-300">$\{substring.slice(1, -1)}</span>\`
                    );
                  } else if (token === 'instance') {
                    output.push(
                      \`<span class="text-sky-600 dark:text-sky-400">$\{substring.slice(2, -2)}</span>\`
                    );
                  } else if (token === 'string') {
                    output.push(
                      \`<span class="text-yellow-600 dark:text-amber-200">$\{substring}</span>\`
                    );
                  } else if (token === 'number') {
                    output.push(
                      \`<span class="text-purple-600 dark:text-purple-400">$\{substring}</span>\`
                    );
                  } else if (token === 'boolean' || token === 'null') {
                    output.push(
                      \`<span class="text-teal-600 dark:text-teal-400">$\{substring}</span>\`
                    );
                  } else if (token === 'undefined') {
                    output.push(
                      \`<span class="text-teal-600 dark:text-teal-400">$\{substring.slice(2, -2)}</span>\`
                    );
                  } else {
                    output.push(substring);
                  }
                  break;
                }
              }
            }
      
            // Return transformed and colorized output
            return output.join('');
          })
          .join(', ');
      }
      
      // Forward errors to parent window
      window.onerror = (...args) => {
        parent.postMessage(
          { type: 'log', log: ['error', stringify([args[4]])] },
          '*'
        );
      };
      
      // Forward logs to parent window
      ['log', 'info', 'debug', 'warn', 'error'].forEach((level) => {
        const original = console[level];
        console[level] = (...args) => {
          parent.postMessage({ type: 'log', log: [level, stringify(args)] }, '*');
          original(...args);
        };
      });
    
      ${code.value}
    </script>
  </head>
  <body></body>
</html>
          `}
        />
      )}
    </main>
  );
});

type EditorButtonsProps = {
  class: string;
  model: Signal<NoSerialize<monaco.editor.ITextModel>>;
  executeCode$: QRL<() => void>;
};

const EditorButtons = component$<EditorButtonsProps>(
  ({ model, executeCode$, ...props }) => {
    // Use navigate and location
    const navigate = useNavigate();
    const location = useLocation();

    // Use copied and shared reset signal
    const copied = useResetSignal(false);
    const shared = useResetSignal(false);

    /**
     * Copies the current code of the editor.
     */
    const copyCode = $(() => {
      // Copy code to clipboard
      copied.value = true;
      navigator.clipboard.writeText(model.value!.getValue());

      // Track playground event
      trackEvent('copy_playground_code');
    });

    /**
     * Shares the current code of the editor.
     */
    const shareCode = $(async () => {
      // Add compressed code to search params
      await navigate(
        `?code=${lz.compressToEncodedURIComponent(model.value!.getValue())}`,
        { replaceState: true }
      );

      // Get current URL with search params
      const url = location.url.href;

      // Share URL or copy it to clipboard
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (navigator.share) {
        navigator.share({ title: 'Playground', url });
      } else {
        shared.value = true;
        navigator.clipboard.writeText(url);
      }

      // Track playground event
      trackEvent('share_playground_code');
    });

    return (
      <div class={clsx('flex space-x-6', props.class)}>
        <IconButton
          type="button"
          variant="secondary"
          label="Copy code"
          hideLabel
          onClick$={copyCode}
        >
          {copied.value ? (
            <CheckIcon class="h-[18px]" />
          ) : (
            <CopyIcon class="h-[18px]" />
          )}
        </IconButton>
        <IconButton
          type="button"
          variant="secondary"
          label="Share code"
          hideLabel
          onClick$={shareCode}
        >
          {shared.value ? (
            <CheckIcon class="h-[18px]" />
          ) : (
            <ShareIcon class="h-[18px]" />
          )}
        </IconButton>
        <IconButton
          type="button"
          variant="secondary"
          label="Execute code"
          hideLabel
          onClick$={executeCode$}
        >
          <PlayIcon class="h-[16px]" />
        </IconButton>
      </div>
    );
  }
);
