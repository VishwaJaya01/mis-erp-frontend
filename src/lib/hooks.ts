import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook for debouncing values
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for async button operations with loading state
 * @param asyncFn - The async function to execute
 * @param options - Configuration options
 * @returns Object with loading state and handler function
 */
export function useAsyncButton(
  asyncFn: () => Promise<void>,
  options: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    successMessage?: string;
    errorMessage?: string;
    showToast?: boolean;
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    onSuccess,
    onError,
    successMessage = 'Success!',
    errorMessage = 'Something went wrong',
    showToast = true,
  } = options;

  const handleClick = useCallback(
    async (e?: React.MouseEvent) => {
      e?.preventDefault();

      if (isLoading) return;

      setIsLoading(true);
      try {
        await asyncFn();

        if (showToast) {
          toast.success(successMessage);
        }

        onSuccess?.();
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');

        if (showToast) {
          toast.error(errorMessage);
        }

        onError?.(err);
      } finally {
        setIsLoading(false);
      }
    },
    [
      asyncFn,
      isLoading,
      onSuccess,
      onError,
      showToast,
      successMessage,
      errorMessage,
    ]
  );

  return { isLoading, handleClick };
}

/**
 * Hook for double-click debouncing
 * @param callback - Function to execute on click
 * @param debounceMs - Debounce time in milliseconds
 * @returns Debounced click handler
 */
export function useDebouncedClick(
  callback: () => void | Promise<void>,
  debounceMs: number = 300
) {
  const lastClickRef = useRef(0);

  return useCallback(
    async (e?: React.MouseEvent) => {
      e?.preventDefault();

      const now = Date.now();
      if (now - lastClickRef.current >= debounceMs) {
        lastClickRef.current = now;
        await callback();
      }
    },
    [callback, debounceMs]
  );
}

/**
 * Hook for managing button confirmation dialogs
 * @param message - Confirmation message
 * @returns Function to wrap async operations
 */
export function useConfirmation(message: string = 'Are you sure?') {
  return useCallback(
    (asyncFn: () => Promise<void>) => async () => {
      if (window.confirm(message)) {
        await asyncFn();
      }
    },
    [message]
  );
}

/**
 * Hook for managing multiple loading states
 * @param initialState - Initial button states
 * @returns Object with state and handlers
 */
export function useMultipleLoading(initialState: Record<string, boolean> = {}) {
  const [loadingStates, setLoadingStates] = useState(initialState);

  const setLoading = useCallback((id: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [id]: loading }));
  }, []);

  const isLoading = useCallback(
    (id: string) => loadingStates[id] ?? false,
    [loadingStates]
  );

  return { loadingStates, setLoading, isLoading };
}
