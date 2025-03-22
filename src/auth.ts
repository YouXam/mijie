import jwt from 'jsonwebtoken';
import Router from 'koa-router';
import compose from 'koa-compose';
import { ObjectId, type Db } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { type GameConfig } from './types';
import { verify } from './turnstile';
import rank from './rank';
import { notice as noticePublish } from './publish';
import { GameProcess, GameStorage } from './gameprocess';
import dotenv from 'dotenv';
import ejs from 'ejs';

dotenv.config();

const banned: Record<string, boolean> = {}

export const gameConfig: GameConfig = {}

if (!process.env.JWT_SECRET) {
    throw Error("环境变量中缺少 JWT_SECRET")
}
const jwtSecret = process.env.JWT_SECRET;

export function authRoutes(db: Db) {
    const router = new Router();
    db.collection('banned').find({ banned: true }).toArray().then(x => x.forEach(y => banned[y.username] = true))
    db.collection('config').findOne({ name: 'game-config' }).then(x => Object.assign(gameConfig, x))

    router.get('/game-config/:option', async (ctx, next) => {
        const { option } = ctx.params as { option?: keyof GameConfig };
        if (!option) {
            ctx.throw(400, 'Missing option');
            return
        }
        if (option === 'gameover') {
            await next();
            return
        }
        if (!gameConfig[option]) {
            if (option === 'endTime') {
                ctx.body = { [option]: '3000-01-01 00:00:00' };
            } else if (option === 'startTime') {
                ctx.body = { [option]: '2000-01-01 00:00:00' };
            } else {
                ctx.body = { [option]: null };
            }
        } else {
            ctx.body = { [option]: gameConfig[option] };
        }
    })

    router.post('/register', async (ctx) => {
        const { username, password, studentID, token } = ctx.request.body as {
            username?: string,
            password?: string,
            studentID?: string,
            token?: string
        }
        if (!await verify(token)) {
            ctx.throw(401, '验证失败');
        }
        if (!username || !password) {
            ctx.throw(400, 'Missing username or password or studentID');
            return
        }
        const condition: Array<{ username: string } | { studentID: string }> = [{ username: username }]
        if (studentID) condition.push({ studentID: studentID })
        const existingUser = await db.collection('users').findOne({
            $or: condition
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
        rank.update()
        ctx.body = { message: '注册成功' };
    });

    router.post('/login', async (ctx) => {
        const { username, password, token: cftoken } = ctx.request.body as {
            username?: string,
            password?: string,
            token?: string
        }
        if (!await verify(cftoken)) {
            ctx.throw(401, '验证失败');
        }
        if (!username || !password) {
            ctx.throw(400, 'Missing username or password');
            return
        }
        const user = await db.collection('users').findOne({ username });
        if (!user || user.password != password) {
            ctx.throw(401, '用户名或密码错误');
            return
        }
        if (banned[username]) {
            ctx.throw(403, '您已被封禁');
        }
        const token = jwt.sign({
            username,
            gameprocess: user.gameprocess,
            gameover: user.gameover,
            admin: user.admin,
            studentID: user.studentID
        }, jwtSecret, { expiresIn: '1d' });
        ctx.body = { message: '登录成功', token, username };
    });

    router.post('/change-password', async (ctx) => {
        const { username, password, newPassword } = ctx.request.body as {
            username?: string,
            password?: string,
            newPassword?: string
        }
        if (!username || !password || !newPassword) {
            ctx.throw(400, 'Missing username or password');
            return
        }
        const user = await db.collection('users').findOne({ username });
        if (!user || user.password != password) {
            ctx.throw(401, '旧密码错误');
        }
        await db.collection('users').updateOne({ username }, { $set: { password: newPassword } });
        ctx.body = { message: '密码修改成功' };
    })

    const check_auth: Router.IMiddleware = async (ctx, next) => {
        const authHeader = ctx.request.headers.authorization;
        if (!authHeader) {
            ctx.throw(401, '未登录');
            return
        }
        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer') {
            ctx.throw(401, 'Invalid authorization header');
        }
        try {
            const payload = jwt.verify(token, jwtSecret) as {
                username: string,
                gameprocess: string,
                gameover: boolean,
                admin: number,
                banned: boolean
            }
            if (payload.banned || banned[payload.username]) {
                ctx.body = { error: '您已被封禁', action: 'logout' };
                return
            }
            ctx.state.username = payload.username;
            ctx.state.gameprocess = new GameProcess(payload.gameprocess, payload.gameover);
            ctx.state.gamestorage = new GameStorage(db, payload.username);
            ctx.state.admin = payload.admin;
            ctx.state.gameconfig = gameConfig;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                ctx.body = { error: '登录过期，请重新登陆', action: 'logout' };
                return
            } else if (err instanceof jwt.JsonWebTokenError) {
                ctx.throw(401, 'Invalid JWT token');
            } else {
                console.error(err);
                ctx.throw(500, 'Internal server error');
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
        check_auth,
        new Router().get('/game-config/gameover', async ctx => {
            ctx.body = {
                gameover: ctx.state.gameconfig.gameover ?
                    ejs.render(ctx.state.gameconfig.gameover, ctx.state) : ''
            };
        }).routes(),
    ]);
}

export function afterAuthRoutes(db: Db) {
    const router = new Router();
    router.post('/change-school-id', async ctx => {
        const { studentID } = ctx.request.body as { studentID?: string };
        if (!studentID) {
            ctx.throw(400, 'Missing studentID');
        }
        await db.collection('users').findOneAndUpdate(
            { username: ctx.state.username },
            { $set: { studentID } },
            // { returnOriginal: false }
        )
        const token = jwt.sign({
            username: ctx.state.username,
            gameprocess: ctx.state.gameprocess.passed,
            gameover: ctx.state.gameprocess.gameover,
            admin: ctx.state.admin,
            studentID
        }, jwtSecret, { expiresIn: '1d' });
        ctx.body = { message: '学号修改成功', token };
        rank.update();
    })
    return compose([
        router.routes(),
        router.allowedMethods()
    ]);
}

export function amdinRoutes(db: Db) {
    const router = new Router();

    router.use(async (ctx, next) => {
        if (ctx.state.admin > 0) {
            await next();
        } else {
            ctx.throw(403, 'Access denied');
        }
    });

    router.get('/game-config', async ctx => {
        ctx.body = {
            endTime: gameConfig.endTime || '3000-01-01 00:00:00',
            startTime: gameConfig.startTime || '2000-01-01 00:00:00',
            gamerule: gameConfig.gamerule || '',
            gameover: gameConfig.gameover || '',
            about: gameConfig.about || ''
        }
    })

    router.put('/game-config', async ctx => {
        await db.collection('config')
            .updateOne(
                { name: 'game-config' },
                { $set: ctx.request.body as Record<string, string> },
                { upsert: true }
            );
        Object.assign(gameConfig, ctx.request.body);
        ctx.body = { message: '修改成功' };
    })

    router.post('/notice', async ctx => {
        const { content } = ctx.request.body as { content?: string };
        if (!content) {
            ctx.throw(400, 'Missing content');
            return
        }
        await db.collection('notices').insertOne({ content, time: new Date(), author: ctx.state.username });
        const minimalContent = content.length > 20 ? content.slice(0, 20) + '...' : content;
        await noticePublish.publish('update', {
            content: minimalContent
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
        const { username } = ctx.request.query as { username?: string };
        const { admin, banned: _banned, hidden, remark } = ctx.request.body as {
            admin?: number,
            banned?: boolean,
            hidden?: boolean,
            remark?: string
        }
        if (!username) {
            ctx.throw(400, 'Missing username');
            return
        }
        if (admin && ctx.state.admin < 2) {
            ctx.throw(403, 'Access denied');
            return
        }
        if (admin && (isNaN(admin) || admin > 2 || admin < 0)) {
            ctx.throw(400, 'Invalid admin value');
            return
        }
        const setValue = {} as {
            admin?: number,
            banned?: boolean,
            hidden?: boolean,
            remark?: string
        }
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

    router.get('/recalculate', async ctx => {
        const uuid = uuidv4();
        rank.update(uuid);
        ctx.body = { message: "已重新计算", uuid };
    })

    return compose([
        router.routes(),
        router.allowedMethods()
    ]);
}