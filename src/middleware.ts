import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    if (req.nextUrl.pathname.startsWith("/api/get-url/")) {
        console.log("returning early");
        return;
    }

    const slug = req.nextUrl.pathname.split("/").pop();

    if (slug) {
        const response = await fetch(
            `${req.nextUrl.origin}/api/get-url/${slug}`
        );

        if (response.ok) {
            const data = await response.json();

            if (data?.url) {
                return NextResponse.redirect(data.url);
            }
        }
    }
}
