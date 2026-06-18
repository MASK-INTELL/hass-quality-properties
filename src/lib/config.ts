export function getBaseUrl(): string {
  return process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://hassproperties.online';
}

export const FOUNDING_YEAR = 2013;
