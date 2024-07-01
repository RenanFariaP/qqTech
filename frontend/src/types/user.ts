import { Profile } from "./profile";

export interface User {
    id: number;
    username: string;
    registration: string;
    profile_id: number;
    email: string;
    password: string;
  }
  
export interface UserWithRelation extends User{
  profile: Profile | null;
}