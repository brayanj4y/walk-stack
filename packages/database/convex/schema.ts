import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    authKitId: v.optional(v.string()), // WorkOS user ID
  }).index("by_authKitId", ["authKitId"]),

  organizations: defineTable({
    name: v.string(),
    workOsOrgId: v.optional(v.string()),
  }).index("by_workOsOrgId", ["workOsOrgId"]),

  memberships: defineTable({
    userId: v.id("users"),
    orgId: v.id("organizations"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  })
    .index("by_user", ["userId"])
    .index("by_org", ["orgId"])
    .index("by_user_org", ["userId", "orgId"]),

  subscriptions: defineTable({
    orgId: v.id("organizations"),
    plan: v.string(),
    status: v.string(),
    periodEnd: v.number(),
    dodoCustomerId: v.optional(v.string()),
    dodoSubId: v.optional(v.string()),
  }).index("by_org", ["orgId"]),

  auditLogs: defineTable({
    orgId: v.id("organizations"),
    userId: v.id("users"),
    action: v.string(),
    details: v.any(),
  }).index("by_org", ["orgId"]),
});
