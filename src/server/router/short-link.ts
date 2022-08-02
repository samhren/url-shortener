import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

function makeSlug(length: number) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

function isValidHttpUrl(tempUrl: string) {
    let url;

    try {
        url = new URL(tempUrl);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export const urlRouter = createRouter()
    .mutation("create", {
        input: z.object({
            url: z.string().url(),
            slug: z.string().optional(),
            userId: z.string(),
        }),
        async resolve({ ctx, input }) {
            if (!input.slug) {
                input.slug = makeSlug(12);
            }

            if (
                !isValidHttpUrl(input.url) ||
                input.slug.includes("/") ||
                input.slug.includes(" ")
            ) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Invalid URL",
                });
            }

            const shortLink = await ctx.prisma.shortLink.create({
                data: {
                    url: input.url,
                    slug: input.slug,
                    userId: input.userId,
                },
            });

            return shortLink;
        },
    })
    .query("get-users", {
        input: z.object({
            userId: z.string(),
        }),
        async resolve({ ctx, input }) {
            const shortLinks = await ctx.prisma.shortLink.findMany({
                where: {
                    userId: input.userId,
                },
                orderBy: {
                    createdAt: "asc",
                },
            });

            return shortLinks;
        },
    });