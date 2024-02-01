class PluginServer {
    constructor(plugin) {
        this.plugin = plugin;
        this._handlers = new Map();
    }
    
    on(event, handler) {
        this._handlers.set(event, async (...args) => {
            const tmp = handler(...args);
            if (tmp instanceof Promise) {
                return await tmp;
            }
            return tmp;
        });
    }

    async handle(event, ...args) {
        if (!this._handlers.has(event)) {
            throw new Error(`Event ${event} not found`);
        }
        return await this._handlers.get(event)(...args);
    }
}

module.exports = PluginServer;