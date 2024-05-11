import { UserJsonService } from "../user/user.json-service";
import { ChatRoomService } from "./chatRoom.service";

const amqp = require('amqplib');

export class ChatRoomJsonService implements ChatRoomService {
    private channel: any;
    private queueName = "chat-messages";
    private exchangeName = "chat-exchange";
    private messages: { userId: number; username: string; message: string; date: string; }[] = [];


    constructor() {
        this.setupRabbitMQ()
            .then(() => this.consumeMessagesFromRabbitMQ())
            .catch(error => console.error('Error setting up RabbitMQ:', error));

        this.messages = this.messages || [];
        
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
        await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true });
        await this.channel.publish(this.exchangeName, '', Buffer.from(JSON.stringify(newMessage)), { persistent: true });
        return newMessage;
    }

    async getMessages(): Promise<{ userId: number; username: string; message: string; date: string; }[]> {
        if (this.messages.length === 0) {
            await this.fetchMessagesFromRabbitMQ();
        }
        return this.messages;
    }

    async fetchMessagesFromRabbitMQ(): Promise<void> {
        try {
            const messages = await this.channel.get(this.queueName, { noAck: true });
            if (messages) {
                messages.forEach((msg: any) => {
                    const receivedMessage: { userId: number; username: string; message: string; date: string } = JSON.parse(msg.content.toString());
                    this.messages.push(receivedMessage);
                    console.log('Received message:', receivedMessage);
                });
            }
        } catch (error) {
            console.error('Error fetching messages from RabbitMQ:', error);
            throw new Error('Error fetching messages from RabbitMQ: ' + error);
        }
    }


    async consumeMessagesFromRabbitMQ() {
        await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true });

        await this.channel.assertQueue(this.queueName, { durable: true });
        
        // Bind the queue to the exchange
        await this.channel.bindQueue(this.queueName, this.exchangeName, '');

        console.log('Waiting for messages...');
        this.channel.consume(this.queueName, (msg: any) => {
            if (msg.content) {
                const receivedMessage: { userId: number; username: string; message: string; date: string } = JSON.parse(msg.content.toString());
                this.messages.push(receivedMessage);
                console.log('Received message:', receivedMessage);
            
            }
        }, { noAck: true });
    }
}
