const Router = require('koa-router');
const GameProcess = require('./gameprocess');
const jwt = require('jsonwebtoken');
const compose = require('koa-compose');

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET || require('uuid').v4();

function authRoutes(db) {
    const router = new Router();

    router.post('/register', async (ctx) => {
        const { username, password } = ctx.request.body;
        if (!username || !password) {
            ctx.throw(400, 'Missing username or password');
        }
        const existingUser = await db.collection('users').findOne({ username });
        if (existingUser) {
            ctx.throw(409, 'Username already taken');
        }
        const newUser = { username, password };
        await db.collection('users').insertOne(newUser);
        ctx.body = { message: 'User registered successfully' };
    });

    router.post('/login', async (ctx) => {
        const { username, password } = ctx.request.body;
        if (!username || !password) {
            ctx.throw(400, 'Missing username or password');
        }
        const user = await db.collection('users').findOne({ username });
        if (!user || user.password != password) {
            ctx.throw(401, 'Invalid username or password');
        }
        const token = jwt.sign({ username, gameprocess: user.gameprocess }, jwtSecret, { expiresIn: '1d' });
        ctx.body = { message: 'Login successful', token  };
    });

    const check_auth = async (ctx, next) => {
        const authHeader = ctx.request.headers.authorization;
        if (!authHeader) {
            ctx.throw(401, 'Missing authorization header');
        }
        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer') {
            ctx.throw(401, 'Invalid authorization header');
        }
        try {
            const payload = jwt.verify(token, jwtSecret);
            ctx.state.username = payload.username;
            ctx.state.gameprocess = new GameProcess(payload.gameprocess);
        } catch (err) {
            ctx.throw(401, 'Invalid JWT token');
        }
        await next();
        if (ctx?.state?.gameprocess && ctx.state.gameprocess.changed) {
            const token = jwt.sign({ username: ctx.state.username, gameprocess: ctx.state.gameprocess.passed }, jwtSecret, { expiresIn: '1d' });
            ctx.body = { token, ...ctx.body };
        }
    };

    return compose([
        router.routes(),
        check_auth
    ]);
}

module.exports = authRoutes
