"use client";

import { useSerwist } from "@serwist/next/react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const SPARKLE_D =
  "M12 0c0 6.075 4.925 11 11 11-6.075 0-11 4.925-11 11 0-6.075-4.925-11-11-11 6.075 0 11-4.925 11-11z";

export function PwaUpdatePrompt() {
  const { serwist } = useSerwist();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const userRequestedUpdate = useRef(false);

  useEffect(() => {
    if (!serwist) return;

    const onWaiting = () => setUpdateAvailable(true);
    const onControlling = () => {
      if (userRequestedUpdate.current) window.location.reload();
    };

    serwist.addEventListener("waiting", onWaiting);
    serwist.addEventListener("controlling", onControlling);

    return () => {
      serwist.removeEventListener("waiting", onWaiting);
      serwist.removeEventListener("controlling", onControlling);
    };
  }, [serwist]);

  const activate = () => {
    userRequestedUpdate.current = true;
    serwist?.messageSkipWaiting();
  };

  const show = updateAvailable && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start gap-3">
            <svg
              viewBox="0 0 40 40"
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-300"
            >
              <g transform="translate(9 9) scale(0.55)">
                <path fill="currentColor" d={SPARKLE_D} />
              </g>
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                New version available
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Refresh to get the latest updates
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button variant="primary" onClick={activate}>
                  Refresh
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setDismissed(true)}
                >
                  Later
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
