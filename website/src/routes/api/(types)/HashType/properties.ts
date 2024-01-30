import type { PropertyProps } from '~/components';

export const properties: Record<string, PropertyProps> = {
  HashType: {
    type: {
      type: 'union',
      options: [
        {
          type: 'string',
          value: 'md4',
        },
        {
          type: 'string',
          value: 'md5',
        },
        {
          type: 'string',
          value: 'sha1',
        },
        {
          type: 'string',
          value: 'sha256',
        },
        {
          type: 'string',
          value: 'sha384',
        },
        {
          type: 'string',
          value: 'sha512',
        },
        {
          type: 'string',
          value: 'ripemd128',
        },
        {
          type: 'string',
          value: 'ripemd160',
        },
        {
          type: 'string',
          value: 'tiger128',
        },
        {
          type: 'string',
          value: 'tiger160',
        },
        {
          type: 'string',
          value: 'tiger192',
        },
        {
          type: 'string',
          value: 'crc32',
        },
        {
          type: 'string',
          value: 'crc32b',
        },
        {
          type: 'string',
          value: 'adler32',
        },
      ],
    },
  },
};
