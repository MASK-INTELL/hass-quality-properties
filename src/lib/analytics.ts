declare function gtag(command: 'event', action: string, params?: Record<string, string | number | boolean | undefined>): void;

type GtagParams = Record<string, string | number | boolean | undefined>;

export function gtagEvent(name: string, params?: GtagParams) {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    gtag('event', name, params);
  }
}
