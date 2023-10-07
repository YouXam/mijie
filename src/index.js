const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const MongoClient = require('mongodb').MongoClient;
const { authRoutes, amdinRoutes } = require('./auth');
const game = require('./game');

require('dotenv').config();

function httpServer(db) {
    const app = new Koa();
    const beforeAuth = new Router();
    const afterAuth = new Router();

    beforeAuth.get('/ping', async (ctx) => {
        ctx.body = 'pong';
    });

    app.use(bodyParser());
    app.use(beforeAuth.routes());
    app.use(authRoutes(db));
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
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    httpServer(client.db());
})()

