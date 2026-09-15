export const RELEASE_VERSION = import.meta.env.VITE_APP_VERSION || 'Development build';
export const RELEASE_CHANNEL = import.meta.env.VITE_RELEASE_CHANNEL || (import.meta.env.DEV ? 'Development' : 'Preview');
export const RELEASE_COMMIT = import.meta.env.VITE_RELEASE_COMMIT || 'local';
export const RELEASE_DATE = import.meta.env.VITE_RELEASE_DATE || 'Not published';