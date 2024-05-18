import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * MIME type issue type.
 */
export interface MimeTypeIssue<
  TInput extends Blob,
  TRequirement extends `${string}/${string}`[],
> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'mime_type';
  /**
   * The expected input.
   */
  readonly expected: string;
  /**
   * The MIME types.
   */
  readonly requirement: TRequirement;
}

/**
 * MIME type action type.
 */
export interface MimeTypeAction<
  TInput extends Blob,
  TRequirement extends `${string}/${string}`[],
  TMessage extends
    | ErrorMessage<MimeTypeIssue<TInput, TRequirement>>
    | undefined,
> extends BaseValidation<TInput, TInput, MimeTypeIssue<TInput, TRequirement>> {
  /**
   * The action type.
   */
  readonly type: 'mime_type';
  /**
   * The action reference.
   */
  readonly reference: typeof mimeType;
  /**
   * The expected property.
   */
  readonly expects: string;
  /**
   * The MIME types.
   */
  readonly requirement: TRequirement;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a MIME type validation action.
 *
 * @param requirement The MIME types.
 *
 * @returns A MIME type action.
 */
export function mimeType<
  TInput extends Blob,
  const TRequirement extends `${string}/${string}`[],
>(requirement: TRequirement): MimeTypeAction<TInput, TRequirement, undefined>;

/**
 * Creates a MIME type validation action.
 *
 * @param requirement The MIME types.
 * @param message The error message.
 *
 * @returns A MIME type action.
 */
export function mimeType<
  TInput extends Blob,
  const TRequirement extends `${string}/${string}`[],
  const TMessage extends
    | ErrorMessage<MimeTypeIssue<TInput, TRequirement>>
    | undefined,
>(
  requirement: TRequirement,
  message: TMessage
): MimeTypeAction<TInput, TRequirement, TMessage>;

export function mimeType(
  requirement: `${string}/${string}`[],
  message?: ErrorMessage<MimeTypeIssue<Blob, `${string}/${string}`[]>>
): MimeTypeAction<
  Blob,
  `${string}/${string}`[],
  ErrorMessage<MimeTypeIssue<Blob, `${string}/${string}`[]>> | undefined
> {
  return {
    kind: 'validation',
    type: 'mime_type',
    reference: mimeType,
    async: false,
    expects: requirement.map((option) => `"${option}"`).join(' | '),
    requirement,
    message,
    _run(dataset, config) {
      if (
        dataset.typed &&
        !this.requirement.includes(dataset.value.type as `${string}/${string}`)
      ) {
        _addIssue(this, 'MIME type', dataset, config);
      }
      return dataset;
    },
  };
}
