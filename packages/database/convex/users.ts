import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
    args: { authKitId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_authKitId", (q) => q.eq("authKitId", args.authKitId))
            .unique();
    },
});

export const createUser = mutation({
    args: {
        email: v.optional(v.string()),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        authKitId: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_authKitId", (q) => q.eq("authKitId", args.authKitId))
            .unique();

        if (existing) {
            return existing._id;
        }

        return await ctx.db.insert("users", {
            email: args.email,
            name: args.name,
            image: args.image,
            authKitId: args.authKitId,
        });
    },
});
