"use client";

import { useState } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "convex/react";
import { useAuth, useAccessToken } from "@workos-inc/authkit-nextjs/components";
import type * as React from "react";

function useAuthFromWorkOS() {
    const { user } = useAuth();
    const { getAccessToken, loading } = useAccessToken();

    return {
        isLoading: loading,
        isAuthenticated: !!user,
        fetchAccessToken: async (_opts: { forceRefreshToken: boolean }) => {
            const token = await getAccessToken();
            return token ?? null;
        },
    };
}

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
    // Lazy init: useState with an initializer runs only once, client-side only.
    // This prevents module-level instantiation during Next.js SSR/prerendering.
    const [convex] = useState(
        () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
    );

    return (
        <ConvexProviderWithAuth client={convex} useAuth={useAuthFromWorkOS}>
            {children}
        </ConvexProviderWithAuth>
    );
}
