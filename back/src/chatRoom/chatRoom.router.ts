import e, { Router } from "express";
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
                    res.status(201).json(result);
                } else {
                    res.status(500).json({ message: "Error while sending message" });
                }
            } catch (error: unknown) {
                res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error occurred" });
            }
        });

        this.router.get('/get-messages', async (req, res, next) => {
            try {
                const messages = await this.chatRoomController.getMessages();
                if (!messages) {
                    res.status(500).json({ message: "Error while getting messages" });
                }
                res.status(200).json(messages);
            } catch (error: unknown) {
                next(error);
            }
        });
    }
}
