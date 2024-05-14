import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import { ExpressRouter } from './express-router';
import http from 'http';

export class ExpressServer {
  private express = express();
  private httpServer!: http.Server;

  constructor(
    private expressRouter: ExpressRouter,
    private port: string
    ) {
        this.configureBodyParser();
        this.configureCors();
        this.configureRoutes();
        this.configureHttpServer();
    }

    private configureHttpServer(): void {
      this.httpServer = http.createServer(this.express);
      
    }


  bootstrap(): void {
    this.httpServer.listen(this.port, () => {
        console.log(`> Listening on port ${this.port}`)
    });
  }

  private configureBodyParser(): void {
    this.express.use(bodyParser.json());
  }
  private configureCors(): void {
    this.express.use(cors());
  }

  private configureRoutes(): void {
    this.express.use('/api', this.expressRouter.router);
  }

  getHttpServer(): http.Server {
    return this.httpServer;
  }

}
