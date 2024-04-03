import { ExpressRouter } from "./express-router";
import { ExpressServer } from "./express-server";
import { UserJsonService } from "../user/user.json-service";
import { UserService } from "../user/user.service";
import { ChatRoomService } from "../chatRoom/chatRoom.service";
import { ChatRoomJsonService } from "../chatRoom/chatRoom.json-service";
import * as dotenv from 'dotenv';

export class ExpressApplication {
  private expressRouter!: ExpressRouter;
  private port!: string;
  private server!: ExpressServer;
  private userService!: UserService;
  private chatRoomService!: ChatRoomService;

  constructor() {  
    this.configureEnvironment();
    this.configureServerPort();
    this.configureServices();
    this.configureExpressRouter();
    this.configureServer();
  }

 
  bootstrap(): void {
    this.server.bootstrap();
  }

  private configureEnvironment(): void {
    dotenv.config({ path: '.env'});
  }

  private getPort(): string {
    const port = process.env.PORT;
    if (!port) {
      throw new Error('Port is not defined');
    }

    return port;
    
  }
  private configureServerPort(): void {
    this.port = this.getPort();
  }

  private configureServices(): void {
    this.userService = UserJsonService.getInstance();
    this.chatRoomService = new ChatRoomJsonService();

  }
  private configureExpressRouter(): void {
    this.expressRouter = new ExpressRouter(this.userService, this.chatRoomService);

  }
  
  private configureServer(): void {
    this.server = new ExpressServer(this.expressRouter, this.port);
  }

}
