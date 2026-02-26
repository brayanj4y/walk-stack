import { AuthKit, type AuthFunctions } from "@convex-dev/workos-authkit";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

// `internal.auth` points to the exports of this very file (self-reference).
// Convex codegen handles this — it is the correct pattern for Actions.
const authFunctions: AuthFunctions = internal.auth;

export const authKit = new AuthKit<DataModel>(components.workOSAuthKit, {
    authFunctions,
});

export const { authKitEvent } = authKit.events({
    "user.created": async (ctx, event) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_authKitId", (q) => q.eq("authKitId", event.data.id))
            .unique();

        if (existing) return;

        await ctx.db.insert("users", {
            authKitId: event.data.id,
            email: event.data.email,
            name:
                [event.data.firstName, event.data.lastName]
                    .filter(Boolean)
                    .join(" ") || undefined,
            image: event.data.profilePictureUrl ?? undefined,
        });
    },

    "user.updated": async (ctx, event) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_authKitId", (q) => q.eq("authKitId", event.data.id))
            .unique();

        if (!user) return;

        await ctx.db.patch(user._id, {
            email: event.data.email,
            name:
                [event.data.firstName, event.data.lastName]
                    .filter(Boolean)
                    .join(" ") || undefined,
            image: event.data.profilePictureUrl ?? undefined,
        });
    },

    "user.deleted": async (ctx, event) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_authKitId", (q) => q.eq("authKitId", event.data.id))
            .unique();

        if (!user) return;

        await ctx.db.delete(user._id);
    },
});

export const { authKitAction } = authKit.actions({
    /**
     * Called on every login attempt.
     * Return response.deny("reason") to block the login.
     */
    authentication: async (_ctx, _action, response) => {
        // Default: allow all logins.
        // Add custom logic here, e.g. block suspended accounts.
        return response.allow();
    },

    /**
     * Called on every new user registration attempt.
     * Return response.deny("reason") to block the registration.
     */
    userRegistration: async (_ctx, action, response) => {
        // Example: block disposable / test email domains
        const blockedDomains = ["mailinator.com", "guerrillamail.com"];
        const emailDomain = (action.userData.email.split("@")[1] ?? "").toLowerCase().trim();
        if (blockedDomains.includes(emailDomain)) {
            return response.deny("Disposable email addresses are not allowed.");
        }
        return response.allow();
    },
});
