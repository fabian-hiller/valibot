import type { Pipe, PipeAsync, PipeMeta } from '../../types';

const hasPipeMeta = (val: unknown): val is PipeMeta =>
  typeof val === `function` && `kind` in val && `message` in val;

export const getChecks = <const TPipe extends Pipe<any> | PipeAsync<any>>(
  pipe?: TPipe
) =>
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
