import clsx from 'clsx';
import { TextLink } from './TextLink';

type SingleTypeOrValue =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'null'
  | 'undefined'
  | 'void'
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
        key: string | { name: string; type: TypeOrValue };
        value: TypeOrValue;
      }[];
    }
  | {
      type: 'array';
      item: TypeOrValue;
    }
  | {
      type: 'tuple';
      items: TypeOrValue[];
    }
  | {
      type: 'function';
      params: { name: string; type: TypeOrValue }[];
      return: TypeOrValue;
    }
  | {
      type: 'custom';
      name: string;
      generics?: { name?: string; type: TypeOrValue }[];
      href?: string;
    };

type TypeOrValue = SingleTypeOrValue | SingleTypeOrValue[];

type PropertyProps = {
  type: TypeOrValue;
  default?: TypeOrValue;
  padding?: 'none';
};

/**
 * Visually represents the type and default value of a property with syntax
 * highlighting using JSON schema as props.
 */
export function Property(props: PropertyProps) {
  const types = Array.isArray(props.type) ? props.type : [props.type];

  return (
    <code
      class={clsx(
        '!bg-transparent !p-0 !text-slate-600 dark:!text-slate-300',
        !props.padding && '!px-2'
      )}
    >
      {types.map((type, index) => (
        <>
          <span class="text-red-600 dark:text-red-400">
            {index > 0 && ' | '}
          </span>
          {typeof type === 'string' ? (
            <span
              class={{
                'text-purple-600 dark:text-purple-400':
                  type === 'number' || type === 'bigint',
                'text-teal-600 dark:text-teal-400':
                  type === 'string' ||
                  type === 'boolean' ||
                  type === 'null' ||
                  type === 'undefined' ||
                  type === 'void' ||
                  type === 'any' ||
                  type === 'unknown',
                'capitalize text-sky-600 dark:text-sky-400':
                  type === 'object' ||
                  type === 'array' ||
                  type === 'tuple' ||
                  type === 'function',
              }}
            >
              {type}
            </span>
          ) : type.type === 'string' ? (
            <span class="text-yellow-600 dark:text-amber-200">
              '{type.value}'
            </span>
          ) : type.type === 'number' || type.type === 'bigint' ? (
            <span class="text-purple-600 dark:text-purple-400">
              {type.value}
            </span>
          ) : type.type === 'boolean' ? (
            <span
              class={clsx(
                type.value
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {type.value.toString()}
            </span>
          ) : type.type === 'object' ? (
            <span class="text-slate-600 dark:text-slate-400">
              {'{'}
              {type.entries.map((entrie, index) => (
                <>
                  {index === 0 ? ' ' : ', '}
                  <>
                    {typeof entrie.key === 'string' ? (
                      entrie.key
                    ) : (
                      <>
                        [{entrie.key.name}:{' '}
                        <Property type={entrie.key.type} padding="none" />]
                      </>
                    )}
                  </>
                  : <Property type={entrie.value} padding="none" />
                  {index === type.entries.length - 1 && ' '}
                </>
              ))}
              {'}'}
            </span>
          ) : type.type === 'array' ? (
            <span>
              {Array.isArray(type.item) && type.item.length > 1 && '('}
              <Property type={type.item} padding="none" />
              {Array.isArray(type.item) && type.item.length > 1 && ')'}
              <span class="text-slate-600 dark:text-slate-400">[]</span>
            </span>
          ) : type.type === 'tuple' ? (
            <span class="text-slate-600 dark:text-slate-400">
              [
              {type.items.map((item, index) => (
                <>
                  {index > 0 && ', '}
                  <Property type={item} padding="none" />
                </>
              ))}
              ]
            </span>
          ) : type.type === 'function' ? (
            <span class="text-slate-600 dark:text-slate-400">
              {Array.isArray(type.return) && '('}(
              {type.params.map((param, index) => (
                <>
                  <span>
                    {index > 0 && ', '}
                    {param.name}:{' '}
                  </span>
                  <Property type={param.type} padding="none" />
                </>
              ))}
              ) {'=>'} <Property type={type.return} padding="none" />
              {Array.isArray(type.return) && ')'}
            </span>
          ) : (
            <>
              {type.href ? (
                <TextLink href={type.href}>{type.name}</TextLink>
              ) : (
                <span class="text-sky-600 dark:text-sky-400">{type.name}</span>
              )}
              {type.generics && (
                <>
                  {'<'}
                  {type.generics.map((generic, index) => (
                    <>
                      {index > 0 && ', '}
                      {generic.name && (
                        <>
                          <span class="text-sky-600 dark:text-sky-400">
                            {generic.name}
                          </span>
                          <span class="text-slate-600 dark:text-slate-400">
                            {' '}
                            ={' '}
                          </span>
                        </>
                      )}
                      <Property type={generic.type} padding="none" />
                    </>
                  ))}
                  {'>'}
                </>
              )}
            </>
          )}
        </>
      ))}
      {props.default && (
        <>
          {' = '}
          <Property type={props.default} padding="none" />
        </>
      )}
    </code>
  );
}
