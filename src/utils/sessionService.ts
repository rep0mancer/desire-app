/**
 * A simple module for tracking whether a search was performed during the
 * current application session. This flag is used in combination with
 * AppState transitions to determine whether to increment the user's
 * `consecutiveInactiveOpens` counter. When a search is made, call
 * `markSearchPerformed()`; when a session ends (app moves to background),
 * the flag can be read via `wasSearchPerformed()` and reset by
 * `resetSearchFlag()`.
 */

let searchPerformedThisSession = false;

/**
 * Mark that a search has been performed during the current session. This
 * should be called whenever the user completes a search on the Home
 * screen.
 */
export function markSearchPerformed(): void {
  searchPerformedThisSession = true;
}

/**
 * Determine whether a search was performed during the current session.
 *
 * @returns `true` if a search was made since the last reset; otherwise
 * `false`.
 */
export function wasSearchPerformed(): boolean {
  return searchPerformedThisSession;
}

/**
 * Reset the search performed flag back to false. Call this after
 * handling the AppState transition logic in `App.tsx`.
 */
export function resetSearchFlag(): void {
  searchPerformedThisSession = false;
}