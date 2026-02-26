"use client";

import { useState } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "convex/react";
import { useAuth, useAccessToken } from "@workos-inc/authkit-nextjs/components";
import type * as React from "react";

function useAuthFromWorkOS() {
    const { user } = useAuth();
    const { getAccessToken, refresh, loading } = useAccessToken();

    return {
        isLoading: loading,
        isAuthenticated: !!user,
        fetchAccessToken: async (_opts: { forceRefreshToken: boolean }) => {
            const token = _opts.forceRefreshToken
                ? await refresh()
                : await getAccessToken();
            return token ?? null;
        },
    };
}

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
    // Lazy init: useState with an initializer runs only once, client-side only.
    // This prevents module-level instantiation during Next.js SSR/prerendering.
    const [convex] = useState(() => {
        const url = process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!url) {
            throw new Error(
                "Missing env var: NEXT_PUBLIC_CONVEX_URL is required. " +
                "Add it to apps/web/.env.local and restart the dev server."
            );
        }
        return new ConvexReactClient(url);
    });

    return (
        <ConvexProviderWithAuth client={convex} useAuth={useAuthFromWorkOS}>
            {children}
        </ConvexProviderWithAuth>
    );
}
