import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const slug = req.query["slug"];

    if (!slug || typeof slug !== "string") {
        res.statusCode = 404;

        res.send(JSON.stringify({ message: "Please use a slug" }));

        return;
    }

    const data = await prisma.shortLink.findFirst({
        where: {
            slug: {
                equals: slug,
            },
        },
    });

    if (!data) {
        res.statusCode = 404;

        res.send(JSON.stringify({ message: "Slug not found" }));

        return;
    }

    await prisma.shortLink.update({
        where: {
            id: data.id,
        },
        data: {
            clicks: data.clicks + 1,
        },
    });
    return res.json(data);
};
