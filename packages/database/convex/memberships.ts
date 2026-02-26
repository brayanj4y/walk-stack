import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserMemberships = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const memberships = await ctx.db
            .query("memberships")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();


        const membershipsWithOrgs = await Promise.all(
            memberships.map(async (m) => {
                const org = await ctx.db.get(m.orgId);
                return { ...m, organization: org };
            })
        );

        return membershipsWithOrgs;
    },
});

export const getOrganizationMembers = query({
    args: { orgId: v.id("organizations") },
    handler: async (ctx, args) => {
        const memberships = await ctx.db
            .query("memberships")
            .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
            .collect();


        const membersWithUsers = await Promise.all(
            memberships.map(async (m) => {
                const user = await ctx.db.get(m.userId);
                return { ...m, user };
            })
        );

        return membersWithUsers;
    },
});

export const addMember = mutation({
    args: {
        userId: v.id("users"),
        orgId: v.id("organizations"),
        role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    },
    handler: async (ctx, args) => {

        const existing = await ctx.db
            .query("memberships")
            .withIndex("by_user_org", (q) =>
                q.eq("userId", args.userId).eq("orgId", args.orgId)
            )
            .unique();

        if (existing) {
            throw new Error("User is already a member of this organization");
        }

        return await ctx.db.insert("memberships", {
            userId: args.userId,
            orgId: args.orgId,
            role: args.role,
        });
    },
});

export const updateMemberRole = mutation({
    args: {
        membershipId: v.id("memberships"),
        role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.membershipId, { role: args.role });
    },
});

export const removeMember = mutation({
    args: {
        membershipId: v.id("memberships"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.membershipId);
    },
});
