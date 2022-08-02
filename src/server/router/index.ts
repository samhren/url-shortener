// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { urlRouter } from "./short-link";
import { protectedExampleRouter } from "./protected-example-router";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("question.", protectedExampleRouter)
    .merge("url.", urlRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
