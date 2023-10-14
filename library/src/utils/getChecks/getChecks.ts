import type { Pipe, PipeAsync, PipeMeta } from '../../types';

const hasPipeMeta = (val: unknown): val is PipeMeta =>
  typeof val === `object` && val !== null && `kind` in val && `message` in val;

export const getChecks = (pipe?: Pipe<any> | PipeAsync<any>) =>
  Array.isArray(pipe)
    ? pipe.reduce<PipeMeta[]>((arr, item) => {
        if (hasPipeMeta(item)) {
          arr.push({
            kind: item.kind,
            requirement: item.requirement,
            message: item.message,
          });
        }
        return arr;
      }, [])
    : [];
