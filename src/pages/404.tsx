import Link from "next/link";
import React from "react";

const Custom404 = () => {
    return (
        <div className="w-screen flex flex-col justify-center items-center">
            <h1 className="mt-[40vh] font-medium text-4xl">
                Redirect not found
            </h1>
            <Link href="/">
                <div className="text-blue-500 mt-4 hover:cursor-pointer">
                    Go back home
                </div>
            </Link>
        </div>
    );
};

export default Custom404;
