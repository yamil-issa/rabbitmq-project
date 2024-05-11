import { Router } from "express";
import { ChatRoomController } from "./chatRoom.controller";

export class ChatRoomRouter {
    public router = Router();

    constructor(private chatRoomController: ChatRoomController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {

        this.router.post('/send-message', async (req, res, next) => {
            try {
                const { username, message } = req.body;
                const result = await this.chatRoomController.sendMessage(username, message);
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "Chat room not found or user not a participant." });
                }
            } catch (error: unknown) {
                next(error);
            }
        });

        this.router.get('/get-messages', async (req, res, next) => {
            try {
                const messages = await this.chatRoomController.getMessages();
                res.status(200).json(messages);
            } catch (error: unknown) {
                next(error);
            }
        });
    }
}
