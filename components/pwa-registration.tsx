"use client";

import { SerwistProvider } from "@serwist/next/react";

export function PwaRegistration({ children }: { children: React.ReactNode }) {
  return (
    <SerwistProvider swUrl="/sw.js" reloadOnOnline>
      {children}
    </SerwistProvider>
  );
}
