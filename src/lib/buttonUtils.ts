import { toast } from 'sonner';
export interface AsyncButtonOptions {
  onSuccess?: (message?: string) => void;
  onError?: (error: Error) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  debounceMs?: number;
}

/**
 * Debounce state to prevent multiple rapid clicks
 */
const clickDebounceMap = new Map<string, number>();

/**
 * Check if enough time has passed for another click (prevent double-clicks)
 */
export function canClick(id: string, debounceMs: number = 300): boolean {
  const lastClick = clickDebounceMap.get(id);
  const now = Date.now();

  if (!lastClick || now - lastClick >= debounceMs) {
    clickDebounceMap.set(id, now);
    return true;
  }

  return false;
}

/**
 * Create a debounced click handler
 */
export function createDebouncedClickHandler(
  handler: () => void | Promise<void>,
  debounceMs: number = 300
) {
  let lastClick = 0;

  return async (e?: React.MouseEvent) => {
    e?.preventDefault();
    const now = Date.now();

    if (now - lastClick >= debounceMs) {
      lastClick = now;
      await handler();
    }
  };
}

/**
 * Create an async handler with loading and error states
 */
export function createAsyncHandler(
  asyncFn: () => Promise<void>,
  options: AsyncButtonOptions = {}
) {
  const {
    onSuccess,
    onError,
    showSuccessToast = true,
    showErrorToast = true,
    successMessage = 'Success!',
    errorMessage = 'Something went wrong',
    debounceMs = 300,
  } = options;

  let isLoading = false;

  return async (e?: React.MouseEvent) => {
    e?.preventDefault();

    if (isLoading) return;

    try {
      isLoading = true;
      await asyncFn();

      if (showSuccessToast) {
        toast.success(successMessage);
      }

      onSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');

      if (showErrorToast) {
        toast.error(errorMessage);
      }

      onError?.(err);
    } finally {
      isLoading = false;
    }
  };
}

/**
 * Create a confirmation handler
 */
export function createConfirmationHandler(
  action: () => void | Promise<void>,
  message: string = 'Are you sure?'
) {
  return async () => {
    if (window.confirm(message)) {
      await action();
    }
  };
}

/**
 * Prevent event propagation and execute handler
 */
export function handleClickWithStopPropagation(
  handler: () => void | Promise<void>
) {
  return (e: React.MouseEvent) => {
    e.stopPropagation();
    handler();
  };
}

/**
 * Trap focus to prevent unintended clicks
 */
export function trapFocus(e: React.KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
  }
}
