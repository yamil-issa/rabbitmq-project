import { User } from "./user";

export interface UserService {
    add(username: string): User;
    getById(id: number): User | null;
    updateUsername(id: number, username: string): User | null;
    setAdminStatus(id: number, isAdmin: boolean): User | null;
}
