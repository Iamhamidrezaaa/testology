"use client";

import { Toaster as Sonner } from "sonner";

export function HotToaster() {
  return (
    <Sonner
      position="top-center"
      toastOptions={{
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
      }}
    />
  );
}

