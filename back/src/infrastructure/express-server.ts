import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import { ExpressRouter } from './express-router';
import WebSocket from 'ws';
import http from 'http';

export class ExpressServer {
  private express = express();
  private httpServer: http.Server;
  private webSocketServer: WebSocket.Server;

  constructor(
    private expressRouter: ExpressRouter,
    private port: string
    ) {
        this.configureBodyParser();
        this.configureCors();
        this.configureRoutes();
        this.configureHttpServer();
        this.configureWebSocketServer();
        this.httpServer = http.createServer(this.express);
        this.webSocketServer = new WebSocket.Server({ server: this.httpServer });
    }

    private configureHttpServer(): void {
      this.httpServer = http.createServer(this.express);
    }

    private configureWebSocketServer(): void {
      this.webSocketServer = new WebSocket.Server({ server: this.httpServer });
   
      this.webSocketServer.on('connection', (webSocket) => {
        console.log('New WebSocket connection');
   
        webSocket.on('message', (message) => {
          console.log(`Received message: ${message}`);
          // Broadcast the message to all connected clients
          this.webSocketServer.clients.forEach((client) => {
            if (client !== webSocket && client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
          });
        });
      });
    }


  bootstrap(): void {
    this.express.listen(this.port, () => {
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
}
