import { useCallback, useMemo, useRef } from 'react';

// Debounce hook
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
};

// Throttle hook
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay]
  );
};

// Memoized selector hook for complex calculations
export const useMemoizedSelector = <T, R>(
  data: T,
  selector: (data: T) => R,
  deps: React.DependencyList = []
): R => {
  return useMemo(() => selector(data), [data, ...deps]);
};