/**
 * Helper functions used throughout the Desire application.
 */

/**
 * Generate a pseudo–random identifier suitable for use as a user ID.
 *
 * The ID is a short alphanumeric string. This helper does not guarantee
 * global uniqueness but provides enough entropy for local use cases. If a
 * stronger guarantee is required, consider integrating a UUID library.
 *
 * @returns A random string consisting of numbers and lowercase letters.
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}