import { APP_ROUTES } from "@/constants/app-routes";
import { checkUserAuthenticated } from "@/functions/check-user-authenticated";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function PrivateRoute ({children}: {children: React.ReactNode}){
    const router = useRouter();

    const isUserAuthenticated =  checkUserAuthenticated();

    useEffect(()=>{
        if(!isUserAuthenticated){
            router.replace(APP_ROUTES.public.login);
        }
    }, [isUserAuthenticated, router]);

    return (
        <>
            {!isUserAuthenticated && null}
            {isUserAuthenticated && children}
        </>
    )
};