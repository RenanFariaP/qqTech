import { APP_ROUTES } from "@/constants/app-routes";
import { checkUserAuthenticated } from "@/functions/check-user-authenticated";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function PublicRoute ({children}: {children: React.ReactNode}){
    const router = useRouter();

    const isUserAuthenticated =  checkUserAuthenticated();

    useEffect(()=>{
        if(isUserAuthenticated){
            router.replace(APP_ROUTES.private.dashboard);
        }
    }, [isUserAuthenticated, router]);

    return (
        <>
            {!isUserAuthenticated && children}
            {isUserAuthenticated && null}
        </>
    )
};