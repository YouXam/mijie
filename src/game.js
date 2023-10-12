const fs = require('fs');
const path = require('path');
const clearModule = require('clear-module');
const chokidar = require('chokidar');
const Router = require('koa-router');
const runCode = require('./games/glot');
const Ranking = require('./rank');
const compose = require('koa-compose');
const send = require('koa-send');
const axios = require('axios');
const { gameConfig } = require('./auth')

function haveCommonKeyValuePair(obj1, obj2) {
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
    constructor() {
        this.taskIntervals = {};
        this.userLastRun = {};
        this.minInterval = 0;
    }
    setInterval(name, interval) {
        this.taskIntervals[name] = interval;
        this.minInterval = Math.min(...Object.values(this.taskIntervals));
    }
    run(user, name) {
        const now = Date.now();
        if (!this.userLastRun[user]) this.userLastRun[user] = {};
        if (!this.userLastRun[user][name]) this.userLastRun[user][name] = 0;

        const timeSinceLastRun = now - this.userLastRun[user][name];
        const timeSinceLastRunAny = now - Math.max(...Object.values(this.userLastRun[user]));
        if ((!this.taskIntervals[name] || timeSinceLastRun >= this.taskIntervals[name]) &&
            timeSinceLastRunAny >= this.minInterval) {
            this.userLastRun[user][name] = now;
            return true;
        } else {
            return false;
        }
    }
}

const taskManager = new TaskManager();

class Plugins {
    constructor() {
        this.first = null;
        this.plugins = {};
        this.pluginMap = new Map();
        this.pluginPre = new Map();
        this.pluginsPath = path.join(__dirname, '../game');
        this.loadPlugins();
        this.watchPlugins();
        this.gamePercent = new Map();
    }
    async getPercent(pid, db) {
        const percent = this.gamePercent.get(pid)
        if (percent) return percent
        const res = await db.collection("problems").findOne({ pid })
        if (res) {
            this.gamePercent.set(pid, res.percent)
            return res.percent
        }
        return null
    }
    async setPercent(pid, percent, db) {
        this.gamePercent.set(pid, percent)
        db.collection('problems').updateOne({ pid }, { $set: { percent }}, { upsert: true });
    }
    loadPlugins() {
        const folders = fs.readdirSync(this.pluginsPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        folders.forEach(folder => {
            this.loadPlugin(folder);
        });
    }
    loadPlugin(folder) {
        const pluginPath = path.join(this.pluginsPath, folder, 'index.js');
        if (fs.existsSync(pluginPath)) {
            clearModule(pluginPath);
            try {
                const plugin = require(pluginPath);
                if (typeof plugin.checker !== 'string' && typeof plugin.checker !== 'function' && !plugin.manualScores) {
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
                if ((plugin.points === undefined || !plugin.checker || (!plugin.description && !plugin.description_file)) && !plugin.manualScores) {
                    console.log(`Failed to load plugin ${folder}: missing points, checker or description`);
                    return
                }
                if (plugin.description_file) {
                    const descriptionPath = path.join(this.pluginsPath, folder, plugin.description_file);
                    if (fs.existsSync(descriptionPath)) {
                        plugin.description = fs.readFileSync(descriptionPath, 'utf8');
                    }
                }
                if (plugin.solved_description_file) {
                    const descriptionPath = path.join(this.pluginsPath, folder, plugin.solved_description_file);
                    if (fs.existsSync(descriptionPath)) {
                        plugin.solved_description = fs.readFileSync(descriptionPath, 'utf8');
                    }
                }
                plugin.folder = folder;
                taskManager.setInterval(plugin.pid, plugin.interval || 10 * 1000);
                if (plugin.first) this.first = plugin.pid
                if (typeof plugin.checker == "string") plugin.checker = (ans => res => res == ans)(plugin.checker);
                this.plugins[folder] = plugin;
                this.computePre();
                this.loaded(folder);
            } catch (error) {
                console.error(`Failed to load plugin ${folder}:`, error);
            }
        }
    }
    unloadPlugin(folder) {
        const pluginPath = path.join(this.pluginsPath, folder, 'index.js');
        if (fs.existsSync(pluginPath) && this.plugins[folder]) {
            clearModule(pluginPath);
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
    watchPlugins() {
        const watcher = chokidar.watch(this.pluginsPath, { persistent: true, ignoreInitial: true });
        const watcherHandler = (filePath, action) => {
            if (action == "load") this.loadPlugin(filePath.replace(this.pluginsPath + "/", '').split("/")[0]);
            else this.unloadPlugin(filePath.replace(this.pluginsPath + "/", '').split("/")[0]);
        }
        watcher
            .on('add', path => watcherHandler(path, "load"))
            .on('change', path => watcherHandler(path, "load"))
            .on("delete", path => watcherHandler(path, "unload"))
    }

    loaded(folder) {
        console.log(`Plugin "${this.plugins[folder].name}" has been loaded/reloaded`);
        this.pluginMap.set(this.plugins[folder].pid, this.plugins[folder]);
    }

    unloaded(folder) {
        console.log(`Plugin "${folder}" has been unloaded`);
        this.pluginMap.delete(folder);
    }
}

const plugins = new Plugins();

let rank = Ranking;

class AI {
    constructor() {
        const keys = (process.env.CLOUDFLARE_API_KEYS || '').split(',');
        this.cloudflare_api_keys = keys.filter(key => key.length > 0).map(x => {
            const [id, key] = x.split(':');
            return { id, key }
        })
        this.cloudflare_api_index = 0;
    }
    next_api_key() {
        this.cloudflare_api_index = (this.cloudflare_api_index + 1) % this.cloudflare_api_keys.length;
        return this.cloudflare_api_keys[this.cloudflare_api_index];
    }
    async run(inputs) {
        const key = this.next_api_key()
        const API_BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${key.id}/ai/run/`;
        const model = "@cf/meta/llama-2-7b-chat-int8";
        const headers = {
            "Authorization": `Bearer ${key.key}`
        };

        try {
            const response = await axios.post(`${API_BASE_URL}${model}`, { messages: inputs }, { headers: headers });
            return response.data;
        } catch (error) {
            console.error("Error during AI dialogue:", error);
            if (error.data) {
                console.error(error.data);
            }
            return 
        }
    }
}

const ai = new AI();

module.exports = function (db) {
    const router = new Router();
    rank.setDB(db);
    router.get('/rank', async (ctx) => {
        ctx.body = {
            rank: await rank.getRank()
        }
    })

    router.get('/start', async (ctx) => {
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
                name: cur.name
            }))
        }
    })

    router.get('/problem', async (ctx) => {
        const problems = Object.keys(ctx.state.gameprocess.passed)
        ctx.body = {
            problems: problems.filter(pid => plugins.pluginMap.get(pid)).map(pid => {
                const cur = plugins.pluginMap.get(pid);
                return {
                    pid: cur.pid,
                    name: cur.name,
                    gameover: cur.gameover,
                    first: cur.first,
                    next: cur.next?.filter(value => plugins.pluginMap.get(value.pid)).map(value => ({
                        pid: value.pid,
                        name: plugins.pluginMap.get(value.pid).name
                    })),
                    manualScores: cur.manualScores
                }
            })
        }
    })

    async function checkPre(ctx, manualUsername = '') {
        const name = ctx.params.name, cur = plugins.pluginMap.get(name), pre = plugins.pluginPre.get(name);
        if (!cur) {
            ctx.throw(404, `Level "${name}" not found`);
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
            ctx.throw(404, `Level "${name}" not found`);
        }
        return cur
    }

    router.get('/problem/:name', async (ctx) => {
        const cur = await checkPre(ctx);
        if (ctx.query.simple) {
            ctx.body = { name: cur.name, manualScores: cur.manualScores };
            return;
        }
        ctx.body = {
            name: cur.name,
            points: cur.points,
            description: cur.description,
            points: cur.points,
            manualScores: cur.manualScores,
            files: cur.files,
            percent: await plugins.getPercent(cur.pid, db)
        };
    });

    router.post('/record/:name', async (ctx) => {
        if (!ctx.state.admin) {
            ctx.throw(403, `Access denied`)
        }
        if (ctx.request.body.points === undefined || !ctx.request.body.username) {
            ctx.throw(400, `Missing username or points`);
        }
        const cur = await checkPre(ctx, ctx.request.body.username);
        const username = ctx.request.body.username;
        if (isNaN(ctx.request.body.points) || parseInt(ctx.request.body.points) < 0) {
            ctx.throw(400, `Invalid points`);
        }
        const points = parseFloat(ctx.request.body.points);
        const record = {
            username,
            pid: cur.pid,
            time: Date.now(),
            name: cur.name,
            msg: ctx.request.body.msg,
            points,
            manualScores: true,
            passed: true,
            gameover: cur.gameover
        };
        await db.collection('records').insertOne(record);
        const setValue = {};
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
            ctx.throw(400, `This level must be manually scored.`);
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
                name: plugins.pluginMap.get(n.pid).name,
                ...n
            })) : undefined,
            solved_description: cur.solved_description,
            points: record.points
        };
    })

    router.post('/problem/:name', async (ctx) => {
        const cur = await checkPre(ctx);
        if (cur.manualScores) {
            ctx.throw(400, `This level need to be automatically scored.`);
        }
        if (new Date(gameConfig.endTime).getTime() < Date.now()) {
            ctx.throw(400, `游戏已结束，无法提交`);
        }
        if (!taskManager.run(ctx.state.username, cur.name)) {
            ctx.body = {
                passed: false,
                msg: "You are sending too many requests. Please try again later."
            };
            return;
        }
        let msg = '', gameStorage = await ctx.state.gamestorage.game(cur.pid), res = null
        try {
            res = cur.checker(ctx.request.body.ans, {
                runCode,
                username: ctx.state.username,
                gameProcess: ctx.state.gameprocess,
                gameStorage,
                ai: inputs => ai.run(inputs),
                msg: (str) => {
                    msg += str;
                }
            })
        } catch (error) {
            console.log(error)
            ctx.throw(500, "checker error, please contact admin");
        }

        if (res instanceof Promise) {
            res = await res.catch(err => {
                console.log(cur.pid, err)
                ctx.throw(500, "checker error, please contact admin");
            })
        }
        

        const record = {
            username: ctx.state.username,
            pid: cur.pid,
            ans: ctx.request.body.ans,
            time: Date.now(),
            name: cur.name,
            msg
        };
        await gameStorage.save();
        
        if (res) {
            let flag = false
            if (!ctx.state.gameprocess.passed.hasOwnProperty(cur.pid)) flag = true;
            ctx.state.gameprocess.pass(cur.pid, cur.points);
            record.passed = true;
            record.points = cur.points;
            const setValue = {};
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
                    $set: { [`gameprocess.${cur.pid}`]: cur.points }
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

            if (flag) rank.update()
            ctx.body = {
                passed: true,
                points: cur.points,
                next: cur.next ? cur.next.map(n => ({
                    name: plugins.pluginMap.get(n.pid).name,
                    ...n
                })) : undefined,
                gameover: cur.gameover,
                msg,
                solved_description: cur.solved_description
            };
        } else {
            record.passed = false;
            ctx.body = {
                passed: false,
                msg
            };
        }
        await db.collection('records').insertOne(record);
        const stat = await db.collection('records').aggregate([
            {
                $match: { pid: cur.pid }
            },
            {
                $group: {
                    _id: null,
                    passed: { $sum: { $cond: [{ $eq: ["$passed", true] }, 1, 0] } },
                    total: { $sum: 1 }
                }
            }
        ]).toArray()
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
        if (!cur.files?.length) {
            ctx.throw(403, `Access denied`)
        }
        if (!cur.files.some(x => {
            if (typeof x == "string") return x == filePath;
            else return x.filename == filePath;
        })) {
            ctx.throw(403, `Access denied`)
        }
        await send(ctx, filePath, { root: path.join(__dirname, '../game', cur.folder) });
    });

    router.get('/record', async (ctx) => {
        let { pid, user, all, page = 1, size = 50 } = ctx.query;
        if (!user) user = ctx.state.username;
        if ((user != ctx.state.username || all) && !ctx.state.admin)
            ctx.throw(403, `Access denied`)
        page = Math.max(1, parseInt(page, 10) || 1);
        size = Math.min(200, Math.max(1, parseInt(size, 10) || 50));
        let query = {};
        if (!all) query.username = user;
        if (pid) query.pid = pid;
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
        const { studentID } = ctx.request.body;
        if (!studentID) {
            ctx.throw(400, 'Missing studentID');
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

    return compose([
        router.routes(),
        router.allowedMethods()
    ])
};
