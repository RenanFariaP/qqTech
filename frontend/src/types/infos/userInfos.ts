import { ModuleInfos } from "./moduleInfos";
import { ProfileInfos } from "./profileInfos";

export interface UserInfos {
    id: number;
    username: string;
    email: string;
    registration: string;
    password: string;
    profile: ProfileInfos | null;
    };