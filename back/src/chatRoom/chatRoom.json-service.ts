import { User } from "../user/user";
import { UserJsonService } from "../user/user.json-service";
import { ChatRoom } from "./chatRoom";
import { ChatRoomService } from "./chatRoom.service";

const amqp = require('amqplib');

export class ChatRoomJsonService implements ChatRoomService {
    private channel: any;
    private chatRoom: ChatRoom;

    constructor() {
        this.chatRoom = new ChatRoom(1, [], []);
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

    
    joinChatRoom(username: string): boolean {
        return false;
        
    }

    async sendMessage(username: string, message: string): Promise<{ userId: number; username: string; message: string; date: string; } | null> {
        const userJsonService = UserJsonService.getInstance();
        let userId = null;
        const user = await userJsonService.getByUsername(username);
        if (!user) {
            throw new Error("User not found.");
        }else {
            userId = user.id;
           
        }
        let timestamp = Date.now();
        let date = this.formatTimestamp(timestamp);
      
        const newMessage = { userId: userId, username, message, date };
        // Publish message to RabbitMQ exchange
        await this.channel.assertExchange('chat-messages', 'direct', { durable: true });
        await this.channel.publish('chat-messages', '', Buffer.from(JSON.stringify(newMessage)), { persistent: true });
        return newMessage;
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
                
                this.chatRoom.messages.push(receivedMessage);
                console.log('Message pushed to chat room:', receivedMessage);
                
            }
        }, { noAck: true });
    }
}
