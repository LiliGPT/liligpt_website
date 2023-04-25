export function redirectTo(path: string) {
  if (typeof window === 'undefined') return;
  window.location.href = path;
}
