import { User } from "../user/user";
import { UserJsonService } from "../user/user.json-service";
import { ChatRoom } from "./chatRoom";
import { ChatRoomService } from "./chatRoom.service";

const amqp = require('amqplib');

export class ChatRoomJsonService implements ChatRoomService {
    private chatRooms: ChatRoom[] = [];
    private channel: any;

    constructor() {
        this.setupRabbitMQ()
            .then(() => this.consumeMessagesFromRabbitMQ())
            .catch(error => console.error('Error setting up RabbitMQ:', error));
    }


    async setupRabbitMQ() {
        try {
            const connection = await amqp.connect('amqp://localhost');
            this.channel = await connection.createChannel();

        } catch (error) {
            console.error('Error establishing RabbitMQ connection:', error);
            throw new Error('Error establishing RabbitMQ connection : ' + error);
        }
    }

    formatTimestamp(timestamp: number): string {
        // Create a new Date object from the timestamp
        const date = new Date(timestamp);
    
        // Get the day, month, and year
        const day = date.getDate();
        const month = date.getMonth() + 1; // getMonth() is zero-based
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
    
        // Format the day, month, year, hours, minutes, and seconds as DD/MM/YYYY - HH:MM:SS
        const formattedDate =
            ('0' + day).slice(-2) +
            '/' +
            ('0' + month).slice(-2) +
            '/' +
            year +
            ' - ' +
            ('0' + hours).slice(-2) +
            ':' +
            ('0' + minutes).slice(-2) +
            ':' +
            ('0' + seconds).slice(-2);
    
        return formattedDate;
    }

    createChatRoom(chatRoomName: string, adminId: number): ChatRoom {
        const userJsonService = UserJsonService.getInstance();
        const adminUser = userJsonService.getById(adminId);
    
        if (adminUser) {
            userJsonService.setAdminStatus(adminId, true);
            const newChatRoom = new ChatRoom(this.chatRooms.length + 1, chatRoomName, adminId);
            newChatRoom.participants.push(adminUser); 
            this.chatRooms.push(newChatRoom);
            return newChatRoom;
        }else {
            throw new Error("Admin user not found.");
        }
        
    }

    getChatRoomById(chatRoomId: number): ChatRoom | null {
        const chatRoom = this.chatRooms.find(room => room.id === chatRoomId);
        return chatRoom || null;
       
    }
    getChatRooms(): ChatRoom[] {
        return this.chatRooms;
    }
        
    joinChatRoom(chatRoomId: number, userId: number): boolean {
        const userJsonService = UserJsonService.getInstance();
        const chatRoom = this.chatRooms.find(room => room.id === chatRoomId);
        if (chatRoom && !chatRoom.participants.some(participant => participant.id === userId)) {
            const user = userJsonService.getById(userId);
            if (user) {
                chatRoom.participants.push(user);
                return true;
            }else {
                console.error(`User with ID ${userId} not found.`);
            }
        }
        return false;
    }

    async sendMessage(chatRoomId: number, userId: number, message: string): Promise<{ userId: number; username: string; message: string; date: string; } | null> {
        const chatRoom = this.chatRooms.find(room => room.id === chatRoomId);
        if (chatRoom && chatRoom.participants.some(participant => participant.id === userId)) {
            let username = "";
            const userJsonService = UserJsonService.getInstance();
            const user = userJsonService.getById(userId);
            if (!user) {
                throw new Error("User not found.");
            }else {
                username = user.username;
            }
            let timestamp = Date.now();
            let date = this.formatTimestamp(timestamp);

            const newMessage = { userId: userId, username, message, date };
            // Publish message to RabbitMQ exchange
            await this.channel.assertExchange('chat-messages', 'direct', { durable: false });
            await this.channel.publish('chat-messages', '', Buffer.from(JSON.stringify(newMessage)));
            return newMessage;
        }
        return null;
    }

    async consumeMessagesFromRabbitMQ() {
        await this.channel.assertExchange('chat-messages', 'direct', { durable: false });
        const queue = await this.channel.assertQueue('', { exclusive: true });
        await this.channel.bindQueue(queue.queue, 'chat-messages', '');

        console.log('Waiting for messages...');
        this.channel.consume(queue.queue, (msg: any) => {
            if (msg.content) {
                const receivedMessage: { userId: number; username: string; message: string; date: string } = JSON.parse(msg.content.toString());
                //console.log('Received message:', receivedMessage);
                //push message to chat room
                const chatRoomIndex = this.chatRooms.findIndex(room => room.participants.some(participant => participant.id ===receivedMessage.userId));
                // If chat room found, push the message to its messages array
            if (chatRoomIndex !== -1) {
                //console.log('chat room :', this.chatRooms[chatRoomIndex]);
                this.chatRooms[chatRoomIndex].messages.push(receivedMessage);
                console.log('Message pushed to chat room:', receivedMessage);
            } else {
                console.error('Chat room not found for message:', receivedMessage);
            }
                
            }
        }, { noAck: true });
    }

    deleteChatRoom(chatRoomId: number, adminId: number): boolean {
        const chatRoomIndex = this.chatRooms.findIndex(room => room.id === chatRoomId && room.adminId === adminId);
        if (chatRoomIndex !== -1) {
            this.chatRooms.splice(chatRoomIndex, 1);
            return true;
        }
        return false;
    }
}
