import { Router } from "express";
import { UserController } from "./user.controller";

export class UserRouter {
    public router = Router();

    constructor(private userController: UserController) {
        this.configureRoutes();
        
    }

    private configureRoutes(): void {
        this.router.get('/:id', (req, res, next) => {
            try {
                const result = this.userController.getById(parseInt(req.params.id));
                res.status(200).json(result);

            }catch (error: unknown) {
                next(error);
            }
        
        });

        this.router.post('/add', (req, res, next) => {
            try {
                const result = this.userController.add(req.body.username);
                res.status(201).json(result);

            }catch (error: unknown) {
                next(error);
            }
        
        });

        this.router.put('/:id/update', (req, res, next) => {
            try {
                const result = this.userController.updateUsername(parseInt(req.params.id), req.body.username);
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "User not found." });
                }
            } catch (error: unknown) {
                next(error);
            }
        });
    }
}
