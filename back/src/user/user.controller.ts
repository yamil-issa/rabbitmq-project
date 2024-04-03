import { containsSpaces, isNegativeNumber, isNotDefined } from "../utils";
import { User } from "./user";
import { UserService } from "./user.service";

export class UserController {
    constructor(private userService: UserService) {}

    add(username: string): User {
        if (isNotDefined(username)) {
            throw new Error("username is not defined.");
        }
        
        if (containsSpaces(username)) {
            throw new Error("username contains spaces.");
        }

        return this.userService.add(username);
    }

    getById(id: number): User | null {
        if (isNegativeNumber(id)) {
            throw new Error("id is a negative number.");
        }

        return this.userService.getById(id);
    }

    updateUsername(id: number, username: string): User | null {
        if (isNotDefined(username)) {
            throw new Error("username is not defined.");
        }
        
        if (containsSpaces(username)) {
            throw new Error("username contains spaces.");
        }
        return this.userService.updateUsername(id, username);
    }
}
