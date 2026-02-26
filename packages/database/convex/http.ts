import { httpRouter } from "convex/server";
import { authKit } from "./auth";

const http = httpRouter();

/**
 * Registers WorkOS routes on your Convex HTTP deployment:
 *   POST /workos/webhook  — receives user.created / user.updated / user.deleted
 *   POST /workos/action   — receives authentication / userRegistration block/allow calls
 *
 * In your WorkOS dashboard, set:
 *   Webhook endpoint:  https://<your-deployment>.convex.site/workos/webhook
 *   Action endpoint:   https://<your-deployment>.convex.site/workos/action
 */
authKit.registerRoutes(http);

export default http;
