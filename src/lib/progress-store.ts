export interface ProgressStore {
  get: () => number;
  set: (value: number) => void;
  subscribe: (listener: () => void) => () => void;
}

/**
 * A tiny mutable value with change listeners. Used to pass scroll progress
 * to the WebGL wheel every frame without re-rendering the React tree.
 */
export function createProgressStore(initial = 0): ProgressStore {
  let value = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => value,
    set: (next) => {
      if (next === value) {
        return;
      }
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
