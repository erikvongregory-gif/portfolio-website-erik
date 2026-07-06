export const QUOTE_MESSAGE_STORAGE_KEY = "evglab:quote-message";
export const OPEN_CONTACT_EVENT = "evglab:open-contact";

type OpenContactFn = (message?: string) => void;

let openContactFn: OpenContactFn | null = null;

/** Registers a global opener. With `replace`, a later instance (e.g. hero) can take over. */
export function registerContactOpenHandler(fn: OpenContactFn, replace = false) {
  if (openContactFn && !replace) return null;
  openContactFn = fn;
  return () => {
    if (openContactFn === fn) openContactFn = null;
  };
}

export function openContactForm(message?: string) {
  openContactFn?.(message);
}

export function requestQuoteConsultation(message: string) {
  openContactForm(message);
  document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
}
