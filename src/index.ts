import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { MongoClient, type Db } from 'mongodb';
import { authRoutes, afterAuthRoutes, amdinRoutes } from './auth';
import game from './game';
import dotenv from 'dotenv';
import send from 'koa-send';

dotenv.config();

function httpServer(db: Db) {
    const app = new Koa();
    app.use(async (ctx, next) => {
        if (ctx.path.startsWith('/api')) {
            ctx.path = ctx.path.slice(4);
            return await next();
        }
        try {
            await send(ctx, ctx.path, { root: __dirname + '/public', index: "index.html" });
        } catch (err) {
            if (ctx.status === 404) {
                await send(ctx, '/index.html', { root: __dirname + '/public' });
            }
        }
    })

    const beforeAuth = new Router();
    beforeAuth.get('/ping', async (ctx) => {
        ctx.body = 'pong';
    });
    beforeAuth.get("/keys", async (ctx) => {
        ctx.body = {
            ably: process.env.ABLY_PUBLIC_KEY,
            turnstile: process.env.TURNSTILE_KEY
        }
    })

    app.use(beforeAuth.routes());
    app.use(bodyParser());
    app.use(authRoutes(db));
    app.use(afterAuthRoutes(db));
    app.use(game(db));
    app.use(amdinRoutes(db));

    const port = process.env.PORT || 5000;
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

