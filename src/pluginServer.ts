import { Plugin } from "./types";

export class PluginServer {
    private plugin: Plugin;
    private _handlers: Map<string, (...args: any[]) => any>;
    constructor(plugin: Plugin) {
        this.plugin = plugin;
        this._handlers = new Map();
    }
    
    on(event: string, handler: (...args: any[]) => any) {
        this._handlers.set(event, async (...args) => {
            const tmp = handler(...args);
            if (tmp instanceof Promise) {
                return await tmp;
            }
            return tmp;
        });
    }

    async handle(_event: string, ...args: any[]) {
        const event = this._handlers.get(_event)
        if (!event) {
            throw new Error(`Event ${event} not found`);
        }
        return await event(...args);
    }
}