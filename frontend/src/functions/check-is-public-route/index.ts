import { APP_ROUTES } from "@/constants/app-routes"

export const checkIstPublicRoute = (asPath: string) =>{
    const appPublicRoutes = Object.values(APP_ROUTES.public);

    return appPublicRoutes.includes(asPath);
}