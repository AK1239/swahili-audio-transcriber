/** Hook for copy to clipboard with feedback */
import { useState, useCallback } from 'react';

interface UseCopyToClipboardOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCopyToClipboard(options?: UseCopyToClipboardOptions) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setShowToast(true);
        options?.onSuccess?.();
        
        // Reset after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to copy');
        options?.onError?.(err);
      }
    },
    [options]
  );

  return {
    copy,
    copied,
    showToast,
  };
}

