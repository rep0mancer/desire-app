/**
 * A simple service to expose the global toast function outside of React
 * components. The ToastProvider registers its internal `showToast` method
 * via `setShowToast`. Other modules (including services) can then call
 * `showToast` directly without requiring React context. This avoids
 * importing hooks into non-component modules.
 */
let showToastRef: ((message: string) => void) | null = null;

/**
 * Called by `ToastProvider` to register its `showToast` function. Should not
 * be used directly by consumers.
 *
 * @param fn - The function to call when a toast should be displayed.
 */
export function setShowToast(fn: (message: string) => void): void {
  showToastRef = fn;
}

/**
 * Display a toast message using the registered `showToast` function. If
 * the provider is not yet registered, this call is ignored.
 *
 * @param message - The message to display.
 */
export function showToast(message: string): void {
  if (showToastRef) {
    showToastRef(message);
  }
}