import { Router } from "express";
import { ChatRoomController } from "./chatRoom.controller";

export class ChatRoomRouter {
    public router = Router();

    constructor(private chatRoomController: ChatRoomController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.post('/create', (req, res, next) => {
            try {
                const { chatRoomName, adminId } = req.body;
                const result = this.chatRoomController.createChatRoom(chatRoomName, adminId);
                res.status(201).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        this.router.get('/:id', (req, res, next) => {
            try {
                const result = this.chatRoomController.getChatRoomById(parseInt(req.params.id));
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });
        //get all chat rooms
        this.router.get('/', (req, res, next) => {
            try {
                const result = this.chatRoomController.getChatRooms();
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        this.router.post('/:id/join', (req, res, next) => {
            try {
                const { userId } = req.body;
                const result = this.chatRoomController.joinChatRoom(parseInt(req.params.id), userId);
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "Chat room not found." });
                }
            } catch (error: unknown) {
                next(error);
            }
        });

        this.router.post('/:id/send-message', async (req, res, next) => {
            try {
                const { userId, message } = req.body;
                const result = await this.chatRoomController.sendMessage(parseInt(req.params.id), userId, message);
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: "Chat room not found or user not a participant." });
                }
            } catch (error: unknown) {
                next(error);
            }
        });
        this.router.delete('/:id/delete', (req, res, next) => {
            try {
                const { adminId } = req.body;
                const result = this.chatRoomController.deleteChatRoom(parseInt(req.params.id), adminId);
                if (result) {
                    res.status(200).json({ message: "Chat room deleted successfully." });
                } else {
                    res.status(404).json({ message: "Chat room not found." });
                }
            } catch (error: unknown) {
                next(error);
            }
        });
    }
}
