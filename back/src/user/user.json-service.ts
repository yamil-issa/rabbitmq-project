import { User } from "./user";
import { UserService } from "./user.service";

const amqp = require('amqplib');

export class UserJsonService implements UserService {
    private static instance: UserJsonService;
    private channel: any;
    private queueName = 'userQueue';

    private constructor() {
        this.setupRabbitMQ()
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

    public static getInstance(): UserJsonService {
        if (!UserJsonService.instance) {
            UserJsonService.instance = new UserJsonService();
        }
        return UserJsonService.instance;
    }

    async add(username: string): Promise<User> {
        // Check if the username is already taken
       /* if (await this.isUsernameTaken(username)) {
            throw new Error("Username is already taken.");
        }
*/
        const userId = this.generateUniqueId();
        const newUser = new User(userId, username);

        // Publish user information as a RabbitMQ message
        await this.publishUserMessage(newUser);

        return newUser;
        
    }

    generateUniqueId(): number {
        return Math.floor(Math.random() * 1000000) + 1;
    }

    async isUsernameTaken(username: string): Promise<boolean> {
        await this.channel.assertQueue(this.queueName, { durable: true });
        
        const { messageCount } = await this.channel.checkQueue(this.queueName);
    
        // Iterate through the messages in the queue to check if the username is taken
        for (let i = 0; i < messageCount; i++) {
            const message = await this.channel.get(this.queueName);
            if (message !== false) {
                const user = JSON.parse(message.content.toString());
                if (user.username === username) {
                    return true; 
                }
            }
        }
    
    
        return false; // Username is not taken
    }
    

    async publishUserMessage(user: User): Promise<void> {
        await this.channel.assertQueue(this.queueName, { durable: true });

        // Publish user information as a message
        this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(user)), { persistent: true });

        console.log(`User information sent to RabbitMQ: ${JSON.stringify(user)}`);
        
    }

    async getByUsername(username: string): Promise<User | null> {
        await this.channel.assertQueue(this.queueName, { durable: true });
    
        const { messageCount } = await this.channel.checkQueue(this.queueName);
        let user = null;
    
        // Iterate through the messages in the queue to check if there is a user with the given username
        for (let i = 0; i < messageCount; i++) {
            const message = await this.channel.get(this.queueName, { noAck: true });
            if (message !== false) {
                const currentUser = JSON.parse(message.content.toString());
                if (currentUser.username === username) {
                    user = currentUser;
                    // Re-publish the message to keep it in the queue
                    await this.channel.sendToQueue(this.queueName, message.content, { persistent: true });
                    break;
                } else {
                    // Re-publish the message to keep it in the queue
                    await this.channel.sendToQueue(this.queueName, message.content, { persistent: true });
                }
            }
        }
    
        return user;
    }
    
    
}
