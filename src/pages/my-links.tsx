import React from "react";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

const MyLinksDisplay: React.FC<{ userId: string }> = ({ userId }) => {
    const { data, isLoading } = trpc.useQuery(["url.get-users", { userId }]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return (
            <div className="w-screen flex justify-center items-center">
                <h1 className="mt-[40vh] font-medium text-4xl">
                    No Links Created
                </h1>
            </div>
        );
    }

    const links = data.map((link) => (
        <div key={link.id}>
            <a href={link.url}>{link.url}</a>
            <a href={link.slug}>{link.slug}</a>
            <div>Clicks: {link.clicks}</div>
        </div>
    ));

    return (
        <>
            <div>My Links</div>
            {links}
        </>
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
