import { containsSpaces, isNotDefined } from "../utils";
import { User } from "./user";
import { UserService } from "./user.service";

export class UserController {
    constructor(private userService: UserService) {}

    async add(username: string): Promise<User> {
        if (isNotDefined(username)) {
            throw new Error("username is not defined.");
        }
        
        if (containsSpaces(username)) {
            throw new Error("username contains spaces.");
        }

        try {
            return await this.userService.add(username);
        } catch (error) {
            throw new Error("Error adding user: " + (error as Error).message); 
        }
    }

    async getByUsername(username: string): Promise<User | null> {
        if (isNotDefined(username)) {
            throw new Error("username is not defined.");
        }

        return await this.userService.getByUsername(username);
    }

}
