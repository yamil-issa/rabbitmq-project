import { Router } from "express";
import { UserService } from "../user/user.service";
import { UserController } from "../user/user.controller";
import { UserRouter } from "../user/user.router";
import { ChatRoomService } from "../chatRoom/chatRoom.service";
import { ChatRoomController } from "../chatRoom/chatRoom.controller";
import { ChatRoomRouter } from "../chatRoom/chatRoom.router";


export class ExpressRouter {
    public router = Router();

    private userController!: UserController;
    private userRouter!: UserRouter;
    private chatRoomRouter!: ChatRoomRouter;


    constructor(private userService: UserService, private chatRoomService: ChatRoomService) {
        this.configuresControllers();
        this.configureRouters();
        this.configureRoutes();

    }

    private configuresControllers(): void {
        this.userController = new UserController(this.userService);
    }
    private configureRouters(): void { 
        this.userRouter = new UserRouter(this.userController);
        this.chatRoomRouter = new ChatRoomRouter(new ChatRoomController(this.chatRoomService));

    }
    private configureRoutes(): void {
        this.router.use('/user', this.userRouter.router);
        this.router.use('/chat-room', this.chatRoomRouter.router); 

    }
}
