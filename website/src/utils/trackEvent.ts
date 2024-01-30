type EventName = 'open_search' | 'select_search_item';
type EventData = { [key: string]: string | number | boolean | undefined };

declare global {
  interface Window {
    umami?: { track: (name: EventName, data?: EventData) => void };
  }
}

/**
 * Tracks custom Umami events.
 *
 * @param name The event name.
 * @param data The event data.
 */
export function trackEvent(name: EventName, data?: EventData) {
  window.umami?.track(name, data);
}
