import { component$, Fragment } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

type DefinitionData =
  | 'string'
  | 'symbol'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'null'
  | 'undefined'
  | 'void'
  | 'never'
  | 'any'
  | 'unknown'
  | 'object'
  | 'array'
  | 'tuple'
  | 'function'
  | {
      type: 'string';
      value: string;
    }
  | {
      type: 'number';
      value: number;
    }
  | {
      type: 'bigint';
      value: number;
    }
  | {
      type: 'boolean';
      value: boolean;
    }
  | {
      type: 'object';
      entries: {
        key:
          | string
          | { name: string; modifier?: string; type?: DefinitionData };
        optional?: boolean;
        value: DefinitionData;
      }[];
    }
  | {
      type: 'array';
      spread?: boolean;
      item: DefinitionData;
    }
  | {
      type: 'tuple';
      items: DefinitionData[];
    }
  | {
      type: 'function';
      params: {
        spread?: boolean;
        name: string;
        optional?: boolean;
        type: DefinitionData;
      }[];
      return: DefinitionData;
    }
  | {
      type: 'union';
      options: [DefinitionData, DefinitionData, ...DefinitionData[]];
    }
  | {
      type: 'intersect';
      options: [DefinitionData, DefinitionData, ...DefinitionData[]];
    }
  | {
      type: 'conditional';
      conditions: {
        type: DefinitionData;
        extends: DefinitionData;
        true: DefinitionData;
      }[];
      false: DefinitionData;
    }
  | {
      type: 'custom';
      modifier?: string;
      name: string;
      href?: string;
      generics?: DefinitionData[];
      indexes?: DefinitionData[];
    };

export type PropertyProps = {
  modifier?: string;
  type: DefinitionData;
  default?: DefinitionData;
};

/**
 * Visually represents the type and default value of a property with syntax
 * highlighting using JSON schema as props.
 */
export const Property = component$<PropertyProps>(
  ({ modifier, type, ...props }: PropertyProps) => {
    return (
      <code class="!bg-transparent !p-0 !text-slate-600 dark:!text-slate-300">
        {modifier && (
          <span class="text-red-600 dark:text-red-400">{modifier} </span>
        )}
        <Definition data={type} />
        {props.default && (
          <>
            {' = '}
            <Definition data={props.default} />
          </>
        )}
      </code>
    );
  }
);

type DefinitionProps = {
  data: DefinitionData;
};

const Definition = component$<DefinitionProps>(({ data }) => (
  <>
    {typeof data === 'string' ? (
      <span
        class={{
          'text-teal-600 dark:text-teal-400':
            data === 'string' ||
            data === 'symbol' ||
            data === 'number' ||
            data === 'bigint' ||
            data === 'boolean' ||
            data === 'null' ||
            data === 'undefined' ||
            data === 'void' ||
            data === 'never' ||
            data === 'any' ||
            data === 'unknown',
          'capitalize text-sky-600 dark:text-sky-400':
            data === 'object' ||
            data === 'array' ||
            data === 'tuple' ||
            data === 'function',
        }}
      >
        {data}
      </span>
    ) : data.type === 'string' ? (
      <span class="text-yellow-600 dark:text-amber-200">'{data.value}'</span>
    ) : data.type === 'number' || data.type === 'bigint' ? (
      <span class="text-purple-600 dark:text-purple-400">{data.value}</span>
    ) : data.type === 'boolean' ? (
      <span class="text-teal-600 dark:text-teal-400">
        {data.value.toString()}
      </span>
    ) : data.type === 'object' ? (
      <span class="text-slate-600 dark:text-slate-400">
        {'{'}
        {data.entries.map((entrie, index) => (
          <Fragment key={index}>
            {index === 0 ? ' ' : ', '}
            <>
              {typeof entrie.key === 'string' ? (
                <span class="text-slate-700 dark:text-slate-300">
                  {entrie.key}
                </span>
              ) : (
                <>
                  [
                  {entrie.key.modifier ? (
                    <>
                      <span class="text-sky-600 dark:text-sky-400">
                        {entrie.key.name}
                      </span>{' '}
                      <span class="text-red-600 dark:text-red-400">
                        {entrie.key.modifier}
                      </span>{' '}
                    </>
                  ) : entrie.key.type ? (
                    <>
                      <span class="italic text-orange-500 dark:text-orange-300">
                        {entrie.key.name}
                      </span>
                      <span class="text-red-600 dark:text-red-400">:</span>{' '}
                    </>
                  ) : (
                    entrie.key.name
                  )}
                  {entrie.key.type && <Definition data={entrie.key.type} />}]
                </>
              )}
            </>
            <span class="text-red-600 dark:text-red-400">
              {entrie.optional && '?'}:
            </span>{' '}
            <Definition data={entrie.value} />
            {index === data.entries.length - 1 && ' '}
          </Fragment>
        ))}
        {'}'}
      </span>
    ) : data.type === 'array' ? (
      <span>
        {data.spread && <span class="text-red-600 dark:text-red-400">...</span>}
        {typeof data.item === 'object' &&
          (data.item.type === 'union' ||
            data.item.type === 'intersect' ||
            (data.item.type === 'custom' && data.item.modifier)) &&
          '('}
        <Definition data={data.item} />
        {typeof data.item === 'object' &&
          (data.item.type === 'union' ||
            data.item.type === 'intersect' ||
            (data.item.type === 'custom' && data.item.modifier)) &&
          ')'}
        <span class="text-slate-600 dark:text-slate-400">[]</span>
      </span>
    ) : data.type === 'tuple' ? (
      <span class="text-slate-600 dark:text-slate-400">
        [
        {data.items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && ', '}
            <Definition data={item} />
          </Fragment>
        ))}
        ]
      </span>
    ) : data.type === 'function' ? (
      <span class="text-slate-600 dark:text-slate-400">
        {typeof data.return === 'object' &&
          (data.return.type === 'union' || data.return.type === 'intersect') &&
          '('}
        (
        {data.params.map((param, index) => (
          <Fragment key={index}>
            <span>
              {index > 0 && ', '}
              {param.spread && (
                <span class="text-red-600 dark:text-red-400">...</span>
              )}
              <span class="italic text-orange-500 dark:text-orange-300">
                {param.name}
              </span>
              <span class="text-red-600 dark:text-red-400">
                {param.optional && '?'}:
              </span>{' '}
            </span>
            <Definition data={param.type} />
          </Fragment>
        ))}
        ) {'=>'} <Definition data={data.return} />
        {typeof data.return === 'object' && data.return.type === 'union' && ')'}
      </span>
    ) : data.type === 'union' ? (
      data.options.map((option, index) => (
        <Fragment key={index}>
          {index > 0 && <span class="text-red-600 dark:text-red-400"> | </span>}
          <Definition data={option} />
        </Fragment>
      ))
    ) : data.type === 'intersect' ? (
      data.options.map((option, index) => (
        <Fragment key={index}>
          {index > 0 && <span class="text-red-600 dark:text-red-400"> & </span>}
          <Definition data={option} />
        </Fragment>
      ))
    ) : data.type === 'conditional' ? (
      <>
        {data.conditions.map((condition, index) => (
          <Fragment key={index}>
            <Definition data={condition.type} />
            <span class="text-red-600 dark:text-red-400"> extends </span>
            <Definition data={condition.extends} />
            <span class="text-red-600 dark:text-red-400"> ? </span>
            <Definition data={condition.true} />
            <span class="text-red-600 dark:text-red-400"> : </span>
          </Fragment>
        ))}
        <Definition data={data.false} />
      </>
    ) : (
      <>
        {data.modifier && (
          <span class="text-red-600 dark:text-red-400">{data.modifier} </span>
        )}
        {data.href ? (
          <Link class="text-sky-600 dark:text-sky-400" href={data.href}>
            {data.name}
          </Link>
        ) : (
          <span class="text-sky-600 dark:text-sky-400">{data.name}</span>
        )}
        {data.generics && (
          <>
            {'<'}
            {data.generics.map((generic, index) => (
              <Fragment key={index}>
                {index > 0 && ', '}
                <Definition data={generic} />
              </Fragment>
            ))}
            {'>'}
          </>
        )}
        {data.indexes?.map((data, index) => (
          <Fragment key={index}>
            {'['}
            <Definition data={data} />
            {']'}
          </Fragment>
        ))}
      </>
    )}
  </>
));
