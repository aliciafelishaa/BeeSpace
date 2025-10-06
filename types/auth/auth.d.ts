import { User } from "firebase/auth";

export interface AuthContextProp {
  user: User | null;
  initializing: boolean;
}
