"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** True after hydration. Gate time-dependent markup behind this so the
 * prerendered HTML never mismatches the client. */
export function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
