import { Profile } from "./profile";

export interface User {
    id: number;
    username: string;
    registration: string;
    email: string;
    password: string;
  }
  
export interface UserWithRelation extends User{
  profile: Profile | null;
}