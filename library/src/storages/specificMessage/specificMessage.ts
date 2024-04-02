import type {
  BaseIssue,
  ErrorMessage,
  FunctionReference,
  InferIssue,
  PipeItemAsync,
} from '../../types/index.ts';

// Create specific message store
let store:
  | Map<
      FunctionReference<
        unknown[],
        PipeItemAsync<unknown, unknown, BaseIssue<unknown>>
      >,
      Map<string | undefined, ErrorMessage<BaseIssue<unknown>>>
    >
  | undefined;

/**
 * Sets a specific error message.
 *
 * @param reference The identifier reference.
 * @param message The error message.
 * @param lang The language of the message.
 */
export function setSpecificMessage<
  const TReference extends FunctionReference<
    unknown[],
    PipeItemAsync<unknown, unknown, BaseIssue<unknown>>
  >,
>(
  reference: TReference,
  message: ErrorMessage<InferIssue<ReturnType<TReference>>>,
  lang?: string
): void {
  if (!store) store = new Map();
  if (!store.get(reference)) store.set(reference, new Map());
  store.get(reference)!.set(lang, message);
}

/**
 * Returns a specific error message.
 *
 * @param reference The identifier reference.
 * @param lang The language of the message.
 *
 * @returns The error message.
 */
export function getSpecificMessage<
  const TReference extends FunctionReference<
    unknown[],
    PipeItemAsync<unknown, unknown, BaseIssue<unknown>>
  >,
>(
  reference: TReference,
  lang?: string
): ErrorMessage<InferIssue<ReturnType<TReference>>> | undefined {
  return store?.get(reference)?.get(lang);
}

/**
 * Deletes a specific error message.
 *
 * @param reference The identifier reference.
 * @param lang The language of the message.
 */
export function deleteSpecificMessage(
  reference: FunctionReference<
    unknown[],
    PipeItemAsync<unknown, unknown, BaseIssue<unknown>>
  >,
  lang?: string
): void {
  store?.get(reference)?.delete(lang);
}
