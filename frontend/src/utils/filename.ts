/** Filename utilities */

/**
 * Extract display name from filename
 * Removes file extension and replaces underscores with spaces
 */
export function getDisplayName(filename: string): string {
  if (!filename) return 'Untitled';
  return filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
}

