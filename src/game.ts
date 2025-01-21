import { Db } from 'mongodb';
import Ranking from './rank';
import Router from 'koa-router';
import fs from 'fs';
import path from 'path';
import compose from 'koa-compose';
import send from 'koa-send';
import jwt from 'jsonwebtoken';
import { minimatch } from 'minimatch';
import { runCode, glot } from './games/glot';
import { verify }from './turnstile';
import { gameConfig } from './auth';
import { Plugin } from './types';
import { Context } from 'koa';
import { PluginServer } from './pluginServer';
import AI, { AiInputs } from './ai';
import { checkBrotli, compressBrotli } from './compress';

function haveCommonKeyValuePair(obj1: Record<string, any>, obj2: Record<string, any>) {
    let smallerObj = obj1, largerObj = obj2;
    if (Object.keys(obj1).length > Object.keys(obj2).length) {
        smallerObj = obj2;
        largerObj = obj1;
    }
    for (const key in smallerObj) {
        if (smallerObj.hasOwnProperty(key) && largerObj.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
}
class TaskManager {
    userCount: Record<string, number>;
    tokens: Record<string, number>;

    constructor() {
        this.userCount = {}
        this.tokens = {}
        setInterval(() => {
            this.userCount = {}
            this.tokens = {}
        }, 1000 * 180)
    }
    async run(user: string, token?: string) {
        if (this.userCount[user] && this.userCount[user] >= 10) {
            if (!token)
                return false
            else {
                const success = await verify(token)
                if (success) this.userCount[user] = 0
                return success
            }
        }
        this.userCount[user] = (this.userCount[user] || 0) + 1
        return true
    }
}

const taskManager = new TaskManager();

class Plugins {
    first: string | null;
    plugins: Record<string, Plugin<any>>;
    pluginMap: Map<string, Plugin<any>>;
    pluginPre: Map<string, Record<string, boolean>>;
    pluginsPath: string;
    gamePercent: Map<string, number>;
    hints: Map<string, {
        content: string,
        pid: string,
        uid: string
    }>;
    constructor() {
        this.first = null;
        this.plugins = {};
        this.pluginMap = new Map();
        this.pluginPre = new Map();
        this.pluginsPath = path.join(__dirname, '../game');
        this.gamePercent = new Map();
        this.hints = new Map();
        this.loadPlugins();
    }
    async getPercent(pid: string, db: Db) {
        const percent = this.gamePercent.get(pid)
        if (percent) return percent
        const res = await db.collection("problems").findOne({ pid })
        if (res) {
            this.gamePercent.set(pid, res.percent)
            return res.percent
        }
        return null
    }
    async setPercent(pid: string, percent: number, db: Db) {
        this.gamePercent.set(pid, percent)
        db.collection('problems').updateOne({ pid }, { $set: { percent } }, { upsert: true });
    }
    loadPlugins() {
        const folders = fs.readdirSync(this.pluginsPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        folders.forEach(folder => {
            this.loadPlugin(folder);
        });
    }
    async loadPlugin(folder: string) {
        const pluginPath = [
            path.join(this.pluginsPath, folder, 'index.js'),
            path.join(this.pluginsPath, folder, 'index.ts')
        ].find(fs.existsSync);
        if (pluginPath) {
            try {
                const plugin = (await import(pluginPath)).default as Plugin<any>;
                if (typeof plugin.checker !== 'string' && typeof plugin.checker !== 'function' && !plugin.manualScores && !plugin.server && plugin.inputs !== false) {
                    console.log(`Failed to load plugin ${folder}: checker is not a string or function`);
                    return
                }
                if (!plugin.name || !plugin.pid) {
                    console.log(`Failed to load plugin ${folder}: missing name or pid`);
                    return
                }
                if (plugin.points !== undefined && (isNaN(plugin.points) || plugin.points < 0)) {
                    console.log(`Failed to load plugin ${folder}: invalid points`);
                    return
                }
                if ((plugin.points === undefined || (plugin.checker === undefined && plugin.server === undefined)) && !plugin.manualScores && plugin.inputs !== false) {
                    console.log(`Failed to load plugin ${folder}: missing points, checker or description`);
                    return
                }
                if (!plugin.description || !plugin.description?.before_solve) {
                    console.log(`Failed to load plugin ${folder}: missing description or description.before_solve`);
                    return
                }
                if (!plugin.description.before_solve.mdv && !plugin.description.before_solve.md && !plugin.description.before_solve.content) {
                    console.log(`Failed to load plugin ${folder}: missing description.before_solve.mdv or description.before_solve.md`);
                    return
                }
                plugin.pid = plugin.pid.toLowerCase()
                if (plugin.next && typeof plugin.next == "object" && plugin.next.length) {
                    for (const value of plugin.next) {
                        if (!value.pid) {
                            console.log(`Failed to load plugin ${folder}: missing pid in next`);
                            return
                        }
                        value.pid = value.pid.toLowerCase()
                    }
                }
                if (plugin.server) {
                    if (typeof plugin.server !== "function") {
                        console.log(`Failed to load plugin ${folder}: server is not a function`);
                        return
                    }
                    plugin.serverInstance = new PluginServer(plugin);
                    try {
                        const instance = plugin.server(plugin.serverInstance);
                        if (instance instanceof Promise) {
                            instance.catch(err => {
                                console.log(`Plugin ${folder} server init error: ` + err);
                            })
                        }
                    } catch (error) {
                        console.log(`Plugin ${folder} server init error: ` + error);
                        return
                    }
                    console.log(`Plugin ${folder} server init success`)
                }
                for (const solve of (['before_solve', 'after_solve'] as const)) {
                    if (plugin.description?.[solve]?.md) {
                        const descriptionPath = path.join(this.pluginsPath, folder, plugin.description[solve].md);
                        if (fs.existsSync(descriptionPath)) {
                            plugin.description[solve].content = fs.readFileSync(descriptionPath, 'utf8');
                        } else {
                            console.log(`Failed to load plugin ${folder}: ${descriptionPath} not found`)
                            return
                        }
                    }
                }
                if (plugin.hints && plugin.hints.length) {
                    for (const hint of plugin.hints) {
                        if (!hint.uid || !hint.content) {
                            console.log(`Failed to load plugin ${folder}: missing uid or content in hint`);
                            return
                        }
                        this.hints.set(hint.uid, {
                            content: hint.content,
                            pid: plugin.pid,
                            uid: hint.uid
                        });
                    }
                }
                plugin.folder = folder;
                if (plugin.first) this.first = plugin.pid
                if (typeof plugin.checker == "string") plugin.checker = ((ans: string) => (res: any) => res === ans)(plugin.checker);
                this.plugins[folder] = plugin;
                this.computePre();
                this.loaded(folder);
            } catch (error) {
                console.error(`Failed to load plugin ${folder}:`, error);
            }
        }
    }
    unloadPlugin(folder: string) {
        const pluginPath = path.join(this.pluginsPath, folder, 'index.js');
        if (fs.existsSync(pluginPath) && this.plugins[folder]) {
            try {
                delete this.plugins[folder];
                this.computePre();
                this.unloaded(folder);
            } catch (error) {
                console.error(`Failed to unload plugin ${folder}:`, error);
            }
        }
    }
    computePre() {
        this.pluginPre.clear();
        Object.keys(this.plugins).forEach(folder => {
            const plugin = this.plugins[folder];
            if (plugin.next && typeof plugin.next == "object" && plugin.next.length) {
                plugin.next.forEach((value, index) => {
                    const plugi = this.pluginPre.get(value.pid) || {};
                    this.pluginPre.set(value.pid, {
                        ...plugi,
                        [plugin.pid]: true
                    });
                });
            }
        });
    }

    loaded(folder: string) {
        if (this.pluginMap.get(this.plugins[folder].pid))
            console.log(`Plugin "${this.plugins[folder].name}" has been reloaded`);
        this.pluginMap.set(this.plugins[folder].pid, this.plugins[folder]);
    }

    unloaded(folder: string) {
        console.log(`Plugin "${folder}" has been unloaded`);
        this.pluginMap.delete(folder);
    }
}

const plugins = new Plugins();

let rank = Ranking;



function checkAllowedFiles(root: string, { include, exclude }: { include: string[], exclude: string[] }, targetPath: string) {
    const absolutePath = path.join(root, targetPath);
    if (exclude) {
        for (const pattern of exclude) {
            if (minimatch(absolutePath, path.join(root, pattern))) {
                return false;
            }
        }
    }
    if (!include) return false;
    for (const pattern of include) {
        if (minimatch(absolutePath, path.join(root, pattern))) {
            return true;
        }
    }

    return false;
}

async function insertRecord(db: Db, record: Record<string, any>) {
    await db.collection('records').insertOne(record);
    const stat = await db.collection("records").aggregate([
        { $match: { pid: record.pid } },
        { $group: { _id: "$username", passed: { $max: "$passed" } } },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                passed: { $sum: { $cond: ["$passed", 1, 0] } }
            }
        }
    ]).toArray();
    const { passed, total } = stat[0];
    const percent = Math.round(passed / total * 10000) / 100;
    plugins.setPercent(record.pid, percent, db)
    return percent
}

const ai = AI;

export default function game(db: Db) {
    const router = new Router();
    rank.setDB(db);
    router.get('/rank', async (ctx) => {
        ctx.body = {
            rank: await rank.getRank()
        }
    })

    router.get('/start', async (ctx) => {
        if (gameConfig.startTime && new Date(gameConfig.startTime).getTime() > Date.now() && !ctx.state.admin) {
            ctx.throw(400, `游戏未开始，请参阅游戏规则。`);
        }
        ctx.body = {
            first: plugins.first
        }
    })

    router.get('/problemList', async (ctx) => {
        if (!ctx.state.admin) {
            ctx.throw(403, `Access denied`)
        }
        ctx.body = {
            problems: Array.from(plugins.pluginMap.values()).map(cur => ({
                pid: cur.pid,
                name: cur.name,
                manualScores: cur.manualScores
            }))
        }
    })

    router.get('/problem', async (ctx) => {
        const problems = Object.keys(ctx.state.gameprocess.passed)
        ctx.body = {
            problems: problems.filter(pid => plugins.pluginMap.has(pid)).map(pid => {
                const cur = plugins.pluginMap.get(pid)!;
                return {
                    pid: cur.pid,
                    name: cur.name,
                    gameover: cur.gameover,
                    first: cur.first,
                    next: cur.next?.filter(value => plugins.pluginMap.has(value.pid)).map(value => ({
                        pid: value.pid,
                        name: plugins.pluginMap.get(value.pid)!.name
                    })),
                    manualScores: cur.manualScores
                }
            })
        }
    })


    router.get('/submitted_problems', async (ctx) => {
        const username = ctx.query.username || ctx.state.username;
        if (!ctx.state.admin && username != ctx.state.username) {
            ctx.throw(403, `Access denied`)
        }
        const problems = await db.collection('records').aggregate([
            { $match: { username: username } },
            { $group: { _id: "$pid", count: { $sum: 1 } } },
        ]).toArray()
        const problemsMap: Record<string, number> = {};
        problems.forEach(e => {
            problemsMap[e._id] = e.count
        })
        const res = {
            submitted_problems: problems.filter(res => plugins.pluginMap.has(res._id)).map(res => {
                const cur = plugins.pluginMap.get(res._id)!;
                return {
                    pid: cur.pid,
                    name: cur.name,
                    manualScores: cur.manualScores,
                    count: res.count
                }
            })
        }
        if (ctx.state.admin) {
            res.submitted_problems = Array.from(plugins.pluginMap.values()).map(cur => ({
                pid: cur.pid,
                name: cur.name,
                manualScores: cur.manualScores,
                count: problemsMap[cur.pid] || 0
            }))
        }
        ctx.body = res;
    })

    async function checkPre(ctx: Context, manualUsername = '') {
        let name = ctx.params.name;
        if (!name) ctx.throw(400, `Missing problem name`)
        name = name.toLowerCase()
        const cur = plugins.pluginMap.get(name), pre = plugins.pluginPre.get(name);
        if (!cur) {
            ctx.throw(404, `Problem "${name}" not found`);
        }
        if (manualUsername.length) {
            const gameprocess = await db.collection("users").findOne({ username: manualUsername }, { projection: { gameprocess: 1 } });
            if (!gameprocess) {
                ctx.throw(404, `没有找到用户 ${manualUsername}`);
            }
            if (pre && Object.keys(pre).length != 0 && !haveCommonKeyValuePair(gameprocess.gameprocess, pre)) {
                ctx.throw(403, `用户 ${manualUsername} 未完成前置关卡`);
            }
            return cur;
        }
        if (!ctx.state.admin && pre && Object.keys(pre).length != 0 && !haveCommonKeyValuePair(ctx.state.gameprocess.passed, pre)) {
            ctx.throw(404, `Problem "${name}" not found`);
        }
        return cur
    }

    router.get('/problem/:name', async (ctx) => {
        const cur = await checkPre(ctx);
        if (ctx.query.simple) {
            ctx.body = {
                name: cur.name,
                manualScores: cur.manualScores,
                inputs: cur.inputs,
            };
            return;
        }
        ctx.body = {
            name: cur.name,
            points: cur.points,
            description: cur.description.before_solve,
            manualScores: cur.manualScores,
            files: cur.files,
            inputs: cur.inputs,
            percent: await plugins.getPercent(cur.pid, db)
        };
    });

    router.post('/record/:name', async (ctx) => {
        if (!ctx.state.admin) {
            ctx.throw(403, `Access denied`)
        }
        const { username, pid, points: pointsSring, passed, gameover, msg } = ctx.request.body as {
            username?: string,
            pid?: string,
            points?: string,
            passed?: boolean,
            gameover?: boolean,
            msg?: string
        };
        if (!pointsSring || !username) {
            ctx.throw(400, `Missing username or points`);
            return
        }
        const cur = await checkPre(ctx, username);
        if (isNaN(parseInt(pointsSring)) || parseInt(pointsSring) < 0) {
            ctx.throw(400, `Invalid points`);
            return
        }
        const points = parseFloat(pointsSring);
        const record = {
            username,
            pid: cur.pid,
            time: Date.now(),
            name: cur.name,
            msg,
            points,
            manualScores: true,
            passed: true,
            gameover: cur.gameover
        };
        await db.collection('records').insertOne(record);
        const setValue: Record<string, any> = {};
        if (record.gameover) setValue.gameover = true;
        const pipeline = [
            {
                $match: { username }
            },
            {
                $set: { [`gameprocess.${cur.pid}`]: record.points }
            },
            {
                $addFields: {
                    isUndefined: { $eq: [`$gameprocess.${cur.pid}`, null] }
                }
            },
            {
                $set: {
                    lastPassed: {
                        $cond: {
                            if: '$isUndefined',
                            then: new Date(),
                            else: { $ifNull: ['$lastPassed', new Date()] },
                        }
                    },
                    points: {
                        $reduce: {
                            input: { $objectToArray: "$gameprocess" },
                            initialValue: 0,
                            in: { $add: ["$$this.v", "$$value"] }
                        }
                    },
                    passed: {
                        $reduce: {
                            input: { $objectToArray: "$gameprocess" },
                            initialValue: 0,
                            in: { $add: [1, "$$value"] }
                        }
                    },
                    ...setValue
                }
            },
            {
                $project: {
                    isUndefined: 0
                }
            },
            {
                $merge: {
                    into: "users",
                    whenMatched: "merge"
                }
            }
        ];

        await db.collection("users").aggregate(pipeline).toArray();

        rank.update()
        ctx.body = {
            message: '添加成功'
        }
    })

    router.get('/problemManual/:name', async (ctx) => {
        const cur = await checkPre(ctx);
        if (!cur.manualScores) {
            ctx.throw(400, `This problem must be manually scored.`);
        }
        const records = await db.collection('records').find({ pid: cur.pid, manualScores: true, passed: true, username: ctx.state.username }).sort({ time: -1 }).limit(1).toArray()
        if (!records.length) {
            ctx.body = {
                passed: false,
                msg: '你还没有通过该关卡'
            }
            return
        }
        const record = records[0];
        let flag = false;
        if (!ctx.state.gameprocess.passed.hasOwnProperty(cur.pid)) flag = true;
        ctx.state.gameprocess.pass(cur.pid, record.points);
        if (record.gameover) ctx.state.gameprocess.setGameover();
        ctx.body = {
            passed: true,
            msg: record.msg || '',
            gameover: record.gameover || false,
            next: cur.next ? cur.next.map(n => ({
                ...n,
                name: plugins.pluginMap.get(n.pid)?.name
            })) : undefined,
            solved_description: cur.description.after_solve,
            points: record.points
        };
    })

    router.get('/skipProblem/:name', async (ctx) => {
        const cur = await checkPre(ctx);
        if (!ctx.state.gameprocess.passed[ctx.params.name]) {
            ctx.throw(400, `You have not passed this problem`);
        }
        const record = await db.collection('records').find({ pid: cur.pid, passed: true, username: ctx.state.username }).sort({ time: -1 }).limit(1).toArray()
        ctx.body = {
            passed: true,
            msg: record[0].msg || '',
            gameover: record[0].gameover || false,
            next: cur.next ? cur.next.map(n => ({
                ...n,
                name: plugins.pluginMap.get(n.pid)?.name
            })) : undefined,
            solved_description: cur.description.after_solve,
            points: record[0].points
        };
    })

    router.post('/problem/:name/server', async (ctx) => {
        const cur = await checkPre(ctx);
        if (!cur.server) {
            ctx.throw(400, `This problem does not have a server`);
        }
        if (gameConfig.startTime && new Date(gameConfig.startTime).getTime() > Date.now() && !ctx.state.admin) {
            ctx.throw(400, `游戏未开始，请参阅游戏规则。`);
        }
        if (gameConfig.endTime && new Date(gameConfig.endTime).getTime() < Date.now() && !ctx.state.admin) {
            ctx.throw(400, `游戏已结束，无法提交`);
        }
        const { event, data } = ctx.request.body as {
            event?: string,
            data?: any
        };
        if (!event) {
            ctx.throw(400, `Missing event`);
        }
        const gameStorage = await ctx.state.gamestorage.game(cur.pid);
        let passed = false, message = '';
        const context = {
            glot,
            runCode,
            username: ctx.state.username,
            gameProcess: ctx.state.gameprocess,
            gameStorage,
            jwt,
            ai: (inputs: any) => ai.run(inputs),
            pass: (msg?: string) => {
                passed = true;
                if (msg) message += msg;
            },
            nopass: (msg?: string) => {
                if (msg) message += msg;
            }
        }
        const eventResponse = await cur.serverInstance.handle(event, data, context);
        await gameStorage.save();
        const res = {
            res: eventResponse
        } as {
            res: any,
            problem?: any,
            percent?: number
        }
        const record  = {
            username: ctx.state.username,
            pid: cur.pid,
            server: true,
            time: Date.now(),
            name: cur.name,
            msg: message,
            passed: false,
            points: 0,
            gameover: false
        }
        if (passed) {
            const passedinfo: Record<string, any> = {};
            passedinfo.msg = message
            passedinfo.passed = record.passed = true;
            passedinfo.points = record.points = cur.points;
            let flag = false
            if (!ctx.state.gameprocess.passed.hasOwnProperty(cur.pid)) flag = true;
            ctx.state.gameprocess.pass(cur.pid, cur.points);
            const setValue: Record<string, any> = {};
            if (cur.gameover) {
                record.gameover = true
                passedinfo.gameover = true;
                setValue.gameover = true;
                ctx.state.gameprocess.setGameover();
            }
            const pipeline = [
                {
                    $match: { username: ctx.state.username }
                },
                {
                    $addFields: {
                        isUndefined: {
                            $cond: {
                                if: { $ifNull: ["$gameprocess." + cur.pid, null] },
                                then: false,
                                else: true
                            }
                        },
                    }
                },
                {
                    $set: { [`gameprocess.${cur.pid}`]: cur.points }
                },
                {
                    $set: {
                        lastPassed: {
                            $cond: {
                                if: '$isUndefined',
                                then: new Date(),
                                else: { $ifNull: ['$lastPassed', new Date()] },
                            }
                        },
                        points: {
                            $reduce: {
                                input: { $objectToArray: "$gameprocess" },
                                initialValue: 0,
                                in: { $add: ["$$this.v", "$$value"] }
                            }
                        },
                        passed: {
                            $reduce: {
                                input: { $objectToArray: "$gameprocess" },
                                initialValue: 0,
                                in: { $add: [1, "$$value"] }
                            }
                        },
                        ...setValue
                    }
                },
                {
                    $project: {
                        isUndefined: 0,
                    }
                },
                {
                    $merge: {
                        into: "users",
                        whenMatched: "merge"
                    }
                }
            ];

            await db.collection("users").aggregate(pipeline).toArray();
            if (flag) rank.update()

            passedinfo.next = cur.next ? cur.next.map(n => ({
                ...n,
                name: plugins.pluginMap.get(n.pid)?.name,
            })) : undefined;
            passedinfo.solved_description = cur.description.after_solve;
            passedinfo.percent = await insertRecord(db, record);
            res.problem = passedinfo;
        } else if (message.length) {
            res.problem = {
                passed: false,
                msg: message
            }
            res.percent = await insertRecord(db, record);
        }
        ctx.body = res;
    })

    router.post('/problem/:name', async (ctx) => {
        const cur = await checkPre(ctx);
        if (cur.manualScores) {
            ctx.throw(400, `This problem need to be automatically scored.`);
        }
        if (gameConfig.startTime && new Date(gameConfig.startTime).getTime() > Date.now() && !ctx.state.admin) {
            ctx.throw(400, `游戏未开始，请参阅游戏规则。`);
        }
        if (gameConfig.endTime && new Date(gameConfig.endTime).getTime() < Date.now() && !ctx.state.admin) {
            ctx.throw(400, `游戏已结束，无法提交`);
        }
        if (cur.inputs === false) {
            ctx.throw(400, `该关卡不能提交答案`);
        }
        const { ans, token } = ctx.request.body as {
            ans?: any,
            token?: string
        };
        if (!await taskManager.run(ctx.state.username, token)) {
            ctx.body = {
                passed: false,
                turnstile: true
            };
            return;
        }
        let msg = '', content = '', gameStorage = await ctx.state.gamestorage.game(cur.pid), res = null
        try {
            if (typeof cur.checker == "string") {
                throw new Error("checker is string")
            }
            res = await cur.checker!(ans, {
                glot,
                runCode,
                username: ctx.state.username,
                gameProcess: ctx.state.gameprocess,
                gameStorage,
                jwt,
                ai: async (inputs: AiInputs) => await ai.run(inputs),
                msg: (str: string) => {
                    msg += str + '\n'
                },
                content: (str: string) => {
                    content += str;
                }
            })
        } catch (error) {
            console.log(error)
            ctx.throw(500, "checker error, please contact admin");
        }

        const record = {
            username: ctx.state.username,
            pid: cur.pid,
            ans,
            time: Date.now(),
            name: cur.name,
            msg,
            content,
            passed: false,
            points: 0,
            gameover: false
        };
        await gameStorage.save();

        if (res) {
            let flag = false
            if (!ctx.state.gameprocess.passed.hasOwnProperty(cur.pid)) flag = true;
            ctx.state.gameprocess.pass(cur.pid, cur.points);
            record.passed = true;
            record.points = cur.points;
            const setValue: Record<string, any> = {};
            if (cur.gameover) {
                record.gameover = true;
                setValue.gameover = true;
                ctx.state.gameprocess.setGameover();
            }
            const pipeline = [
                {
                    $match: { username: ctx.state.username }
                },
                {
                    $addFields: {
                        isUndefined: {
                            $cond: {
                                if: { $ifNull: ["$gameprocess." + cur.pid, null] },
                                then: false,
                                else: true
                            }
                        },
                    }
                },
                {
                    $set: { [`gameprocess.${cur.pid}`]: cur.points }
                },
                {
                    $set: {
                        lastPassed: {
                            $cond: {
                                if: '$isUndefined',
                                then: new Date(),
                                else: { $ifNull: ['$lastPassed', new Date()] },
                            }
                        },
                        points: {
                            $reduce: {
                                input: { $objectToArray: "$gameprocess" },
                                initialValue: 0,
                                in: { $add: ["$$this.v", "$$value"] }
                            }
                        },
                        passed: {
                            $reduce: {
                                input: { $objectToArray: "$gameprocess" },
                                initialValue: 0,
                                in: { $add: [1, "$$value"] }
                            }
                        },
                        ...setValue
                    }
                },
                {
                    $project: {
                        isUndefined: 0,
                    }
                },
                {
                    $merge: {
                        into: "users",
                        whenMatched: "merge"
                    }
                }
            ];

            await db.collection("users").aggregate(pipeline).toArray();
            if (flag) rank.update()
            ctx.body = {
                passed: true,
                points: cur.points,
                next: cur.next ? cur.next.map(n => ({
                    ...n,
                    name: plugins.pluginMap.get(n.pid)?.name
                })) : undefined,
                gameover: cur.gameover,
                msg,
                content,
                solved_description: cur.description.after_solve
            };
        } else {
            record.passed = false;
            ctx.body = {
                passed: false,
                content,
                msg
            };
        }
        await db.collection('records').insertOne(record);
        const stat = await db.collection("records").aggregate([
            { $match: { pid: cur.pid } },
            { $group: { _id: "$username", passed: { $max: "$passed" } } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    passed: { $sum: { $cond: ["$passed", 1, 0] } }
                }
            }
        ]).toArray();
        const { passed, total } = stat[0];
        const percent = Math.round(passed / total * 10000) / 100;
        ctx.body = {
            percent,
            ...ctx.body
        }
        plugins.setPercent(cur.pid, percent, db)
    })

    router.get('/file/:name/:path*', async (ctx) => {
        const { path: filePath } = ctx.params;
        if (!filePath || !filePath?.length) ctx.throw(403, `Access denied`)
        const cur = await checkPre(ctx);
        const root = path.join(__dirname, '../game', cur.folder!)
        const absolutePath = path.join(root, filePath);
        const ext = path.extname(absolutePath);
        const patterns = {
            before_solve: {
                include: cur?.description?.before_solve?.mdv?.include || [],
                exclude: cur?.description?.before_solve?.mdv?.exclude || []
            },
            after_solve: {
                include: cur?.description?.after_solve?.mdv?.include || [],
                exclude: cur?.description?.after_solve?.mdv?.exclude || []
            }
        }
        function setHeaders(res: typeof ctx.res) {
            if (ctx.req.headers['x-application-id'] === 'mdv' && ['.md', '.js', '.ts', '.vue'].includes(ext)) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            }
        }
        if (checkAllowedFiles(root, patterns.before_solve, filePath)
            || checkAllowedFiles(root, patterns.after_solve, filePath)) {
            await checkBrotli(absolutePath);
            await send(ctx, filePath, { root, setHeaders });
            compressBrotli(absolutePath);
            return
        }
        if (!cur.files?.length
            || !cur.files.some(x => {
                if (typeof x == "string") return x == filePath;
                else return x.filename == filePath;
            })
        ) {
            ctx.throw(403, `Access denied`)
        }
        await checkBrotli(absolutePath);
        await send(ctx, filePath, { root, setHeaders });
        compressBrotli(absolutePath);
    });

    router.get('/record', async (ctx) => {
        let { pid, user, all: allStr, page: pageStr = '1', size: sizeStr = '50', passed } = ctx.query as {
            pid?: string,
            user?: string,
            all?: string,
            page?: string,
            size?: string,
            passed?: string
        }
        const all = allStr === 'true';
        if (!user) user = ctx.state.username as string;
        if ((user != ctx.state.username || all) && !ctx.state.admin)
            ctx.throw(403, `Access denied`)
        const page = Math.max(1, parseInt(pageStr, 10) || 1);
        const size = Math.min(200, Math.max(1, parseInt(sizeStr, 10) || 50));
        let query: {
            username?: string,
            pid?: string,
            passed?: boolean
        } = { };
        if (all !== true) query.username = user;
        if (pid) query.pid = pid;
        if (passed !== undefined) query.passed = passed === 'true';
        const [records, total] = await Promise.all([
            db.collection('records')
                .find(query)
                .sort({ time: -1 })
                .skip((page - 1) * size)
                .limit(size)
                .toArray(),
            db.collection('records').countDocuments(query)
        ]);
        ctx.body = {
            page: page,
            total: total,
            records: records
        }
    });

    router.get("/notice", async (ctx) => {
        const notices = await db.collection("notices").find({}).sort({ time: -1 }).toArray();
        ctx.body = { notices };
    });

    router.post('/change-school-id', async ctx => {
        const { studentID } = ctx.request.body as {
            studentID?: string
        }
        if (!studentID) {
            ctx.throw(400, 'Missing studentID');
            return
        }
        const res = await db.collection('users').findOneAndUpdate(
            { username: ctx.state.username, studentID: { $exists: false } },
            { $set: { studentID } },
            { returnDocument: 'after' }
        )
        if (!res) {
            ctx.throw(400, '学号已存在');
        }
        ctx.body = { message: '学号修改成功' };
    })

    router.get('/hint/:uid', async ctx => {
        const hint = plugins.hints.get(ctx.params.uid);
        if (!hint) {
            ctx.throw(404, 'Hint not found');
            return
        }
        const cur = plugins.pluginMap.get(hint.pid);
        if (!cur) {
            ctx.throw(404, 'Problem not found');
            return
        }
        const pre = plugins.pluginPre.get(cur.pid);

        if (!ctx.state.admin && pre && Object.keys(pre).length != 0 && !haveCommonKeyValuePair(ctx.state.gameprocess.passed, pre)) {
            ctx.throw(404, `Problem "${cur.name}" not found`);
        }

        ctx.body = {
            pid: cur.pid,
            content: hint.content
        }
    })

    return compose([
        router.routes(),
        router.allowedMethods()
    ])
};
