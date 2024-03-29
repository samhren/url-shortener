import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const UrlForm: React.FC<{ userId: string }> = ({ userId }) => {
    const [url, setUrl] = useState("");
    const [slug, setSlug] = useState("");

    const [success, setSuccess] = useState(false);

    const [error, setError] = useState("");

    const { mutate: createShortUrl } = trpc.useMutation("url.create", {
        onSuccess: () => {
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 5000);
            setUrl("");
            setSlug("");
        },
        onError: (error, variables, context) => {
            setError(error.message);

            setTimeout(() => {
                setError("");
            }, 5000);
        },
    });

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-lg mb-2">Create a new Short Url</h1>
            <input
                className="w-1/2 mx-auto mb-2"
                type="text"
                placeholder="URL"
                value={url}
                onChange={(e) => {
                    setUrl(e.target.value);
                }}
            />
            <input
                className="w-1/2 mx-auto mb-2"
                type="text"
                placeholder="Slug (optional)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
            />
            <button
                onClick={() => createShortUrl({ userId, url, slug })}
                className="w-fit bg-white hover:bg-gray-100 text-gray-800 font-mnedium py-2 px-4 border rounded shadow my-2"
            >
                Create!
            </button>
            {success && (
                <div className="text-green-500 text-sm mb-2">
                    Successfully created short url!
                </div>
            )}
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        </div>
    );
};

const HomeContents = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session || !session.user?.id) {
        return (
            <div className="w-screen flex justify-center items-center">
                <h1 className="mt-[40vh] font-medium text-4xl">
                    Not logged in
                </h1>
            </div>
        );
    }

    return (
        <div className="w-screen text-center">
            <div className="mt-6 font-semibold text-2xl">
                Hello {session.user?.name}
            </div>
            <div className="my-4">
                <div className="text-blue-500">
                    <Link href="/my-links">My Links</Link>
                </div>
            </div>

            <UrlForm userId={session.user?.id} />
        </div>
    );
};
const Home: NextPage = () => {
    return (
        <>
            <HomeContents />
        </>
    );
};

export default Home;
