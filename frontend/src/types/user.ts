import { ProfileInfos } from "./infos/profileInfos";

export interface User {
    id: number;
    username: string;
    registration: string;
    email: string;
    password: string;
    profile_id: number;
  }
  
export interface UserWithRelation extends User{
  profile: ProfileInfos | null;
}