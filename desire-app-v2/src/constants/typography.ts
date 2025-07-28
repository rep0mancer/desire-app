/**
 * Typography configuration defining font families and commonly used sizes.
 *
 * The Desire application uses a pairing of a serif and a sans–serif typeface
 * to create hierarchy. Playfair Display conveys elegance and weight for
 * headlines while Inter provides legibility for body copy.
 */
export const fonts = {
  /**
   * Font family for headings and large typographic elements.
   */
  heading: 'PlayfairDisplay-Bold',
  /**
   * Font family for general body text and smaller labels.
   */
  body: 'Inter-Regular',
} as const;

/**
 * Commonly used font sizes. Unit is points.
 */
export const sizes = {
  /** Top level headline (e.g. Home prompt). */
  h1: 48,
  /** Section headlines (e.g. screen titles). */
  h2: 32,
  /** Sub–headings. */
  h3: 24,
  /** Standard body copy. */
  body: 16,
  /** Smaller text such as captions and secondary labels. */
  small: 14,
} as const;