import {
  $,
  component$,
  type NoSerialize,
  type Signal,
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

export const head: DocumentHead = {
  title: 'Playground',
  meta: [
    {
      name: 'description',
      content:
        "Write, run, and test your Valibot schemas instantly. Unleash your creativity with Valibot's online code editor.",
    },
  ],
};

type LogLevel = 'log' | 'info' | 'debug' | 'warn' | 'error';

type MessageEventData = {
  type: 'logs';
  level: LogLevel;
  args: unknown[];
};

export default component$(() => {
  // Use location and side bar toggle
  const location = useLocation();
  const toggle = useSideBarToggle();

  // Use model, code and logs signals
  const model = useSignal<NoSerialize<monaco.editor.ITextModel>>();
  const code = useSignal<string>('');
  const logs = useSignal<[LogLevel, string][]>([]);

  // Capture logs from iframe
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    window.addEventListener(
      'message',
      (event: MessageEvent<MessageEventData>) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (event.data.type === 'logs') {
          logs.value = [
            ...logs.value,
            [
              event.data.level,
              event.data.args
                // TODO: Colorize JSON string or change rendering
                .map((arg) => JSON.stringify(arg, null, 2))
                .join(', '),
            ],
          ];
        }
      }
    );
  });

  // Computed initial code of editor
  const initialCode = useComputed$(() => {
    const code = location.url.searchParams.get('code');
    return code
      ? lz.decompressFromEncodedURIComponent(code)
      : `import * as v from 'valibot';

const Schema = v.object({
  email: v.string([v.minLength(1), v.email()]),
  password: v.string([v.minLength(1), v.minLength(8)]),
});

const result = v.safeParse(Schema, {
  email: 'jane@example.com',
  password: '12345678',
});

console.log(result);`;
  });

  return (
    <main class="flex w-full flex-1 flex-col lg:flex-row lg:space-x-10 lg:px-10 lg:py-20 2xl:max-w-[1700px] 2xl:space-x-14 2xl:self-center">
      <div class="flex flex-1 lg:relative">
        <CodeEditor value={initialCode} model={model} />
        <EditorButtons
          class="!hidden lg:!absolute lg:right-10 lg:top-10 lg:!flex"
          model={model}
          code={code}
        />
      </div>

      <SideBar class="lg:w-80 xl:w-96 2xl:w-[448px]" toggle={toggle}>
        <EditorButtons
          q:slot="buttons"
          class="mr-4 lg:hidden"
          toggle={toggle}
          model={model}
          code={code}
        />
        <IconButton
          class="!absolute right-8 top-8 z-10 lg:right-10 lg:top-10"
          type="button"
          variant="secondary"
          label="Clear"
          hideLabel
          onClick$={() => (logs.value = [])}
        >
          <BinIcon class="h-[18px]" />
        </IconButton>
        <ol class="flex h-full flex-col items-start overflow-auto overscroll-contain px-8 py-9 lg:absolute lg:w-full lg:rounded-3xl lg:border-[3px] lg:border-slate-200 lg:p-10 lg:dark:border-slate-800">
          {logs.value.map(([level, message], index) => (
            <li key={index}>
              <pre class="lg:text-lg">
                <span
                  class={clsx(
                    'uppercase',
                    level === 'error'
                      ? 'text-red-600 dark:text-red-400'
                      : level === 'warn'
                        ? 'text-yellow-600 dark:text-amber-200'
                        : 'text-sky-600 dark:text-sky-400'
                  )}
                >
                  {level}
                </span>
                : {message}
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
<html>
  <head>
    <script type="importmap">
      { "imports": { "valibot": "${valibotCode}" } }
    </script>
    <script type="module">
      window.onerror = (...args) => {
        parent.postMessage({ type: "logs", level: "error", args: [args[4]] }, '*');
      }
      ['log', 'info', 'debug', 'warn', 'error'].forEach((level) => {
				const original = console[level];
				console[level] = (...args) => {
          parent.postMessage({ type: "logs", level, args }, '*');
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
  toggle?: ReturnType<typeof useSideBarToggle>;
  model: Signal<NoSerialize<monaco.editor.ITextModel>>;
  code: Signal<string>;
};

const EditorButtons = component$<EditorButtonsProps>(
  ({ toggle, code, model, ...props }) => {
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

    /**
     * Executes the current code of the editor.
     */
    const executeCode = $(() => {
      // Open side bar if it's closed
      if (!toggle?.value || toggle.value.state === 'closed') {
        toggle?.submit({ state: 'opened' });
      }

      // Update code of iframe
      code.value = `// ${Date.now()}\n${
        transform(model.value!.getValue(), {
          transforms: ['typescript'],
        }).code
      }`;

      // Track playground event
      trackEvent('execute_playground_code');
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
          onClick$={executeCode}
        >
          <PlayIcon class="h-[16px]" />
        </IconButton>
      </div>
    );
  }
);
