import React from "react";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const MyLinksDisplay: React.FC<{ userId: string }> = ({ userId }) => {
    const { data, isLoading } = trpc.useQuery(["url.get-users", { userId }]);

    const { mutate: deleteShortUrl } = trpc.useMutation("url.delete");

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-screen flex flex-col justify-center items-center">
                <h1 className="mt-[40vh] font-medium text-4xl">
                    No Links Created
                </h1>
                <Link href="/">
                    <div className="text-blue-500 mt-4 hover:cursor-pointer">
                        Go back home
                    </div>
                </Link>
            </div>
        );
    }

    let hostname = "";

    if (typeof window !== "undefined") {
        hostname = window.location.origin;
    }

    if (!hostname) {
        return <div>Hostname not found</div>;
    }

    const links = data.map((link) => (
        <div
            key={link.id}
            className="bg-white rounded-lg py-2 px-4 w-fit my-2 flex justify-center"
        >
            <div className="h-fit my-auto mx-4 mr-6">
                <FontAwesomeIcon icon={faLink} size="2x" />
            </div>
            <div>
                <div>
                    Link:{" "}
                    <a href={link.url} className="text-blue-500">
                        {link.url}
                    </a>
                </div>
                <div>
                    Shortcut:{" "}
                    <a href={link.slug} className="text-blue-500">
                        {hostname}/{link.slug}
                    </a>
                </div>
                <div>Clicks: {link.clicks}</div>
            </div>
            <div className="h-fit my-auto mx-4 ml-6 text-red-500">
                <button
                    onClick={() => {
                        deleteShortUrl({ id: link.id });
                        window.location.reload();
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} size="2x" />
                </button>
            </div>
        </div>
    ));

    return (
        <div className="flex text-center flex-col items-center">
            <div className="font-semibold my-4">My Links</div>
            {links}
        </div>
    );
};

const myLinks = () => {
    const { data: session, status } = useSession();
    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session || !session.user?.id) {
        return (
            <div>
                <h1>My Links</h1>
                <p>You need to be signed in to view this page.</p>
            </div>
        );
    }

    return <MyLinksDisplay userId={session.user.id} />;
};

export default myLinks;
