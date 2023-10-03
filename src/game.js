const fs = require('fs');
const path = require('path');
const clearModule = require('clear-module');
const chokidar = require('chokidar');
const Router = require('koa-router');

function haveCommonKeyValuePair(obj1, obj2) {
    const smallerObj = obj1, largerObj = obj2;
    if (Object.keys(obj1).length > Object.keys(obj2).length) {
        smallerObj = obj2;
        largerObj = obj1;
    }
    for (const key in smallerObj) {
        if (smallerObj.hasOwnProperty(key) && largerObj.hasOwnProperty(key)) {
            if (smallerObj[key] === largerObj[key]) {
                return true;
            }
        }
    }
    return false;
}

class Plugins {
    constructor() {
        this.first = null;
        this.plugins = {};
        this.pluginMap = new Map();
        this.pluginPre = new Map();
        this.pluginsPath = path.join(__dirname, '../game');
        this.loadPlugins();
        this.watchPlugins();
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
                if (!plugin.name || !plugin.slug || !plugin.checker || (!plugin.description && !plugin.description_file)) {
                    console.log(`Failed to load plugin ${folder}: missing name, slug, checker or description`);
                    return
                }
                if (plugin.description_file) {
                    const descriptionPath = path.join(this.pluginsPath, folder, plugin.description_file);
                    if (fs.existsSync(descriptionPath)) {
                        plugin.description = fs.readFileSync(descriptionPath, 'utf8');
                    }
                }
                if (plugin.next && typeof plugin.next == "object" && plugin.next.length) {
                    plugin.next.forEach((value, index) => {
                        const plugi = this.pluginPre.get(value.slug) || {};
                        this.pluginPre.set(value.slug, {
                            ...plugi,
                            [plugin.slug]: true
                        });
                    });
                }
                if (plugin.first) this.first = plugin.slug
                if (typeof plugin.checker == "string") plugin.checker = (ans => res => res == ans)(plugin.checker);
                this.plugins[folder] = plugin;
                this.loaded(folder);
            } catch (error) {
                console.error(`Failed to load plugin ${folder}:`, error);
            }
        }
    }
    unloadPlugin(folder) {
        const pluginPath = path.join(this.pluginsPath, folder, 'index.js');
        if (fs.existsSync(pluginPath) && this.plugins[folder]) {
            if (plugin.next && typeof plugin.next == "object" && plugin.next.length) {
                plugin.next.forEach((value, index) => {
                    const plugi = this.pluginPre.get(value.slug) || {};
                    delete plugi[plugin.slug];
                    this.pluginPre.set(value.slug, plugi);
                });
            }
            clearModule(pluginPath);
            try {
                delete this.plugins[folder];
                this.loaded(folder);
            } catch (error) {
                console.error(`Failed to unload plugin ${folder}:`, error);
            }
        }
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
        this.pluginMap.set(this.plugins[folder].slug, this.plugins[folder]);
    }

    unloaded(folder) {
        console.log(`Plugin "${folder}" has been unloaded`);
        this.pluginMap.delete(folder);
    }
}

const plugins = new Plugins();

module.exports = function (db) {
    const router = new Router();

    router.get('/problem', async (ctx) => {
        const problems = Object.keys(ctx.state.gameprocess.passed)
        ctx.body = {
            problems: problems.map(slug => {
                const cur = plugins.pluginMap.get(slug);
                return {
                    slug: cur.slug,
                    next: cur.next?.map(value => value.slug)
                }
            })
        }
    })

    router.get('/start', async (ctx) => {
        ctx.body = {
            first: plugins.first
        }
    })

    router.get('/problem/:name', async (ctx) => {
        const name = ctx.params.name, cur = plugins.pluginMap.get(name), pre = plugins.pluginPre.get(name);
        if (!cur) {
            ctx.throw(404, `Level "${name}" not found`);
        }
        if (pre && Object.keys(pre).length != 0 && !haveCommonKeyValuePair(ctx.state.gameprocess.passed, pre)) {
            ctx.throw(404, `Level "${name}" not found`);
        }
        ctx.body = {
            name: cur.name,
            description: cur.description,
            description_file: cur.description_file,
        };
    });

    router.post('/problem/:name', async (ctx) => {
        const name = ctx.params.name, cur = plugins.pluginMap.get(name), pre = plugins.pluginPre.get(name);
        if (!cur) {
            ctx.throw(404, `Level "${name}" not found`);
        }
        if (pre && Object.keys(pre).length != 0 && !haveCommonKeyValuePair(ctx.state.gameprocess.passed, pre)) {
            ctx.throw(404, `Level "${name}" not found`);
        }
        if (ctx.state.gameprocess.passed[name]) {
            ctx.body = {
                passed: true,
                next: cur.next
            };
        } else {
            if (cur.checker(ctx.request.body.ans)) {
                ctx.state.gameprocess.pass(name)
                await db.collection('users').updateOne({ username: ctx.state.username }, { $set: { ["gameprocess." + name]: true} });
                ctx.body = { 
                    passed: true,
                    next: cur.next,
                    gameover: cur.gameover
                };
            } else {
                ctx.body = {
                    passed: false
                };
            }
        }
    })


    return router.routes();
};
