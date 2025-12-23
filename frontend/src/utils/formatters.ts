/** Formatting utilities */

/**
 * Format date in Swahili locale (full format)
 */
export function formatDateSwahili(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('sw-KE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  } catch {
    return dateString;
  }
}

/**
 * Format date in Swahili locale (short format for action items)
 */
export function formatDateSwahiliShort(dateString?: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('sw-KE', { 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
}

/**
 * Format date in English locale (with time)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

