import { User } from "./user";

export interface UserService {
    add(username: string): Promise<User>;
    getByUsername(username: string): Promise<User | null>;
}
