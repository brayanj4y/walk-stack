import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export const proxy = authkitMiddleware();

// Match against pages and API routes
export const config = {
    matcher: [
        '/',
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
