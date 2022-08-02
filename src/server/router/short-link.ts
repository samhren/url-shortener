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

function isValidSlug(slug: string) {
    if (/^[a-zA-Z0-9_-]+$/.test(slug)) {
        return true;
    }
    return false;
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
            url: z.string(),
            slug: z.string().optional(),
            userId: z.string(),
        }),
        async resolve({ ctx, input }) {
            if (!input.slug) {
                input.slug = makeSlug(12);
            }

            if (!isValidHttpUrl(input.url)) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Invalid URL",
                });
            }

            if (input.slug.length < 4) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Slug must be at least 4 characters",
                });
            }

            if (input.slug.length > 12) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Slug must be less than 12 characters",
                });
            }

            if (!isValidSlug(input.slug)) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message:
                        "Slug can only contain letters, numbers, dashes, and underscores",
                });
            }

            const slugDuplicate = await ctx.prisma.shortLink.findFirst({
                where: {
                    slug: input.slug,
                },
            });

            if (slugDuplicate) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Slug already exists",
                });
            }

            const countUserCreated = await ctx.prisma.shortLink.count({
                where: {
                    userId: input.userId,
                },
            });

            if (countUserCreated >= 10) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message:
                        "You have reached the maximum number of short links",
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
    })
    .mutation("delete", {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ ctx, input }) {
            const shortLink = await ctx.prisma.shortLink.delete({
                where: {
                    id: input.id,
                },
            });

            return shortLink;
        },
    });
