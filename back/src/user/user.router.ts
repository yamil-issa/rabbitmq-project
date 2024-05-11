import { Router } from "express";
import { UserController } from "./user.controller";

export class UserRouter {
    public router = Router();

    constructor(private userController: UserController) {
        this.configureRoutes();
        
    }

    private configureRoutes(): void {
        this.router.get('/', async (req, res, next) => {
            try {
                const result = await this.userController.getByUsername(req.query.username as string);
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "User not found.", code: 404 });
                }
            } catch (error: any) {
                const statusCode = 500;
                const errorMessage = error.message;
                res.status(statusCode).json({ message: errorMessage, code: statusCode });
            }
        });

        this.router.post('/add', async (req, res, next) => {
            try {
                const result = await this.userController.add(req.body.username);
                res.status(201).json(result);

            }catch (error:any) {
                const statusCode = 400;
                const errorMessage = error.message;
                res.status(statusCode).json({ message: errorMessage, code: statusCode });
            }
        
        });
    }
}
