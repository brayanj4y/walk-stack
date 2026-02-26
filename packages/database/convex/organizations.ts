import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrganization = query({
    args: { orgId: v.id("organizations") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.orgId);
    },
});

export const getOrganizationByWorkOsId = query({
    args: { workOsOrgId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("organizations")
            .withIndex("by_workOsOrgId", (q) => q.eq("workOsOrgId", args.workOsOrgId))
            .unique();
    },
});

export const createOrganization = mutation({
    args: {
        name: v.string(),
        workOsOrgId: v.optional(v.string()),
        ownerId: v.id("users"),
    },
    handler: async (ctx, args) => {

        const orgId = await ctx.db.insert("organizations", {
            name: args.name,
            workOsOrgId: args.workOsOrgId,
        });


        await ctx.db.insert("memberships", {
            userId: args.ownerId,
            orgId: orgId,
            role: "owner",
        });

        return orgId;
    },
});

export const updateOrganization = mutation({
    args: {
        orgId: v.id("organizations"),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.orgId, { name: args.name });
    },
});
