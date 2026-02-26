"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { ConvexClientProvider } from "./ConvexClientProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthKitProvider>
      <ConvexClientProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {children}
        </NextThemesProvider>
      </ConvexClientProvider>
    </AuthKitProvider>
  );
}
