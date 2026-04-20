/**
 * Executes a callback within a View Transition if supported by the browser.
 * This can be used for smooth theme-switching animations.
 */
export function toggleThemeWithTransition(callback: () => void) {
  if (typeof document === "undefined" || !document.startViewTransition) {
    callback();
    return;
  }

  document.startViewTransition(() => {
    callback();
  });
}
