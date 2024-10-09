import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { MongoClient, type Db } from 'mongodb';
import { authRoutes, afterAuthRoutes, amdinRoutes } from './auth';
import game from './game';
import dotenv from 'dotenv';

dotenv.config();

function httpServer(db: Db) {
    const app = new Koa();
    const beforeAuth = new Router();
    const afterAuth = new Router();

    beforeAuth.get('/ping', async (ctx) => {
        ctx.body = 'pong';
    });

    app.use(bodyParser());
    app.use(beforeAuth.routes());
    app.use(authRoutes(db));
    app.use(afterAuthRoutes(db));
    app.use(game(db));
    app.use(amdinRoutes(db));

    const port = process.env.API_PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}
if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI environment variable');
    process.exit(1);
}


console.log('Connecting to MongoDB');
;(async function main() {
    if (!process.env.MONGODB_URI) {
        console.error('Missing MONGODB_URI environment variable');
        process.exit(1);
    }
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    httpServer(client.db());
})()

