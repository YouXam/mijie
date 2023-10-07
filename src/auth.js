const Router = require('koa-router');
const { GameProcess, GameStorage } = require('./gameprocess');
const jwt = require('jsonwebtoken');
const rank = require('./rank')
const compose = require('koa-compose');

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET || require('uuid').v4();

function authRoutes(db) {
    const router = new Router();

    router.post('/register', async (ctx) => {
        const { username, password, studentID } = ctx.request.body;
        if (!username || !password || !studentID) {
            ctx.throw(400, 'Missing username or password or studentID');
        }
        const existingUser = await db.collection('users').findOne({
            $or: [
                { username: username },
                { studentID: studentID }
            ]
        });
        if (existingUser) {
            if (existingUser.username === username) {
                ctx.throw(409, '该用户名已经被使用');
            } else if (existingUser.studentID === studentID) {
                ctx.throw(409, '该学号已经被使用');
            }
        }
        const newUser = { username, password, studentID };
        await db.collection('users').insertOne(newUser);
        ctx.body = { message: '注册成功' };
    });

    router.post('/login', async (ctx) => {
        const { username, password } = ctx.request.body;
        if (!username || !password) {
            ctx.throw(400, 'Missing username or password');
        }
        const user = await db.collection('users').findOne({ username });
        if (!user || user.password != password) {
            ctx.throw(401, '用户名或密码错误');
        }
        const token = jwt.sign({
            username,
            gameprocess: user.gameprocess,
            gameover: user.gameover,
            admin: user.admin
        }, jwtSecret, { expiresIn: '1d' });
        ctx.body = { message: '登录成功', token, username  };
    });

    router.post('/change-password', async (ctx) => {
        const { username, password, newPassword } = ctx.request.body;
        if (!username || !password || !newPassword) {
            ctx.throw(400, 'Missing username or password');
        }
        const user = await db.collection('users').findOne({ username });
        if (!user || user.password != password) {
            ctx.throw(401, '旧密码错误');
        }
        await db.collection('users').updateOne({ username }, { $set: { password: newPassword } });
        ctx.body = { message: '密码修改成功' };
    })

    const check_auth = async (ctx, next) => {
        const authHeader = ctx.request.headers.authorization;
        if (!authHeader) {
            ctx.throw(401, '未登录');
        }
        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer') {
            ctx.throw(401, 'Invalid authorization header');
        }
        try {
            const payload = jwt.verify(token, jwtSecret);
            ctx.state.username = payload.username;
            ctx.state.gameprocess = new GameProcess(payload.gameprocess, payload.gameover);
            ctx.state.gamestorage = new GameStorage(db, payload.username);
            ctx.state.admin = payload.admin;
        } catch (err) {
            ctx.throw(401, 'Invalid JWT token');
        }
        await next();
        if (ctx?.state?.gameprocess && ctx.state.gameprocess.changed) {
            const token = jwt.sign({
                    username: ctx.state.username,
                    gameprocess: ctx.state.gameprocess.passed,
                    gameover: ctx.state.gameprocess.gameover
                }, jwtSecret, { expiresIn: '1d' });
            ctx.body = { token, ...ctx.body };
        }
    };

    return compose([
        router.routes(),
        router.allowedMethods(),
        check_auth
    ]);
}

function amdinRoutes(db) {
    const router = new Router();

    router.use(async (ctx, next) => {
        if (ctx.state.admin > 0) {
            await next();
        } else {
            ctx.throw(403, 'Access denied');
        }
    });

    router.get('/users', async (ctx) => {
        ctx.body = { users: await rank.getAdminRank() };
    })

    router.put('/user', async (ctx) => {
        const { username } = ctx.request.query;
        const { admin, banned, hidden, remark } = ctx.request.body;
        if (!username) {
            ctx.throw(400, 'Missing username');
        }
        if (admin && ctx.state.admin < 2) {
            ctx.throw(403, 'Access denied');
        }
        if (admin && (isNaN(admin) || admin > 2 || admin < 0)) {
            ctx.throw(400, 'Invalid admin value');
        }
        const setValue = {};
        if (admin != undefined) setValue.admin = admin;
        if (banned != undefined) setValue.banned = banned;
        if (hidden != undefined) setValue.hidden = hidden;
        if (remark != undefined) setValue.remark = remark;
        await db.collection('users').updateOne({ username }, { $set: setValue });
        ctx.body = { message: "修改成功" };
        if (hidden != undefined || banned != undefined) rank.update();
    })

    return compose([
        router.routes(),
        router.allowedMethods()
    ]);
}

module.exports = {
    authRoutes,
    amdinRoutes
}
