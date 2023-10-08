const Router = require('koa-router');
const { GameProcess, GameStorage } = require('./gameprocess');
const jwt = require('jsonwebtoken');
const rank = require('./rank')
const compose = require('koa-compose');
const banned = {}
const { ObjectId } = require('mongodb');
const { notice: noticePublish } = require('./publish');
const uuidv4 = require('uuid').v4;

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET || require('uuid').v4();

function authRoutes(db) {
    const router = new Router();
    db.collection('banned').find({ banned: true }).toArray().then(x => x.forEach(y => banned[y.username] = true))
    router.post('/register', async (ctx) => {
        const { username, password, studentID } = ctx.request.body;
        if (!username || !password) {
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
        if (banned[username]) {
            ctx.throw(403, '您已被封禁');
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
            if (payload.banned || banned[payload.username]) {
                ctx.body = { error: '您已被封禁', action: 'logout' };
                return
            }
            ctx.state.username = payload.username;
            ctx.state.gameprocess = new GameProcess(payload.gameprocess, payload.gameover);
            ctx.state.gamestorage = new GameStorage(db, payload.username);
            ctx.state.admin = payload.admin;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                ctx.body = { error: '登录过期，请重新登陆', action: 'logout' };
            } else if (err instanceof jwt.JsonWebTokenError) {
                ctx.throw(401, 'Invalid JWT token');
            } else {
                ctx.throw(500, 'Internal server error');
                console.error(err);
            }
        }
        await next();
        if (ctx?.state?.gameprocess && ctx.state.gameprocess.changed) {
            const token = jwt.sign({
                username: ctx.state.username,
                gameprocess: ctx.state.gameprocess.passed,
                gameover: ctx.state.gameprocess.gameover,
                admin: ctx.state.admin
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

    router.post('/notice', async ctx => {
        const { content } = ctx.request.body;
        if (!content) {
            ctx.throw(400, 'Missing content');
        }
        await db.collection('notices').insertOne({ content, time: new Date(), author: ctx.state.username });
        noticePublish.publish('update', {
            content
        }, err => {
            if (err) console.error(err);
        });
        ctx.body = { message: '发布成功' };
    })

    router.delete('/notice/:id', async ctx => {
        const { id } = ctx.params;
        if (!id) {
            ctx.throw(400, 'Missing id');
        }
        await db.collection('notices').deleteOne({ _id: new ObjectId(id) });
        ctx.body = { message: '删除成功' };
    })


    router.get('/users', async (ctx) => {
        ctx.body = { users: await rank.getAdminRank() };
    })

    router.put('/user', async (ctx) => {
        const { username } = ctx.request.query;
        const { admin, banned: _banned, hidden, remark } = ctx.request.body;
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
        if (_banned != undefined) {
            setValue.banned = _banned;
            db.collection('banned').updateOne({ username }, { $set: { banned, time: new Date() } }, { upsert: true });
            if (_banned) {
                banned[username] = true;
            } else {
                delete banned[username];
            }
        }
        if (hidden != undefined) setValue.hidden = hidden;
        if (remark != undefined) setValue.remark = remark;
        await db.collection('users').updateOne({ username }, { $set: setValue });
        const uuid = uuidv4();
        ctx.body = { message: "修改成功", uuid };
        if (hidden != undefined || banned != undefined) rank.update(uuid);
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
