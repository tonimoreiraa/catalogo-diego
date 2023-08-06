import { PropsWithChildren } from "react";
import Header from "./Header";

export default function Layout({children}: PropsWithChildren)
{
    return <div className="">
        <Header />
        <div className="px-8 md:px-24 py-12 w-full">
            {children}
        </div>
    </div>
}