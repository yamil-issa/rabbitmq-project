import { User } from "./user";
import { UserService } from "./user.service";

export class UserJsonService implements UserService {
    private static instance: UserJsonService;
    private users: User[] = [];

    private constructor() {}

    public static getInstance(): UserJsonService {
        if (!UserJsonService.instance) {
            UserJsonService.instance = new UserJsonService();
        }
        return UserJsonService.instance;
    }

    add(username: string): User {
        const newUser = new User(this.users.length + 1, username, false);
        this.users.push(newUser);
        return newUser;
    }

    getById(id: number): User | null {
        const user = this.users.find(u => u.id === id);
        return user || null;
    }
    
    updateUsername(id: number, username: string): User | null {
        const userIndex = this.users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            this.users[userIndex].username = username;
            return this.users[userIndex];
        }
        return null;
        
    }
    
    setAdminStatus(userId: number, isAdmin: boolean): User | null {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.isAdmin = isAdmin;
            return user;
        }
        return null;
    }

}
