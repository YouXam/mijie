import { KeysType, Plugin, ServerContext } from "./types";

export class PluginServer<T extends KeysType> {
    private plugin: Plugin<T>;
    private _handlers: Map<string, (data: any, ctx: ServerContext) => any>;
    constructor(plugin: Plugin<T>) {
        this.plugin = plugin;
        this._handlers = new Map();
    }
    
    on<E>(event: string, handler: (data: E, ctx: ServerContext) => any) {
        this._handlers.set(event, async (data: E, ctx: ServerContext) => {
            const tmp = handler(data, ctx);
            if (tmp instanceof Promise) {
                return await tmp;
            }
            return tmp;
        });
    }

    async handle(_event: string, data: any, ctx: ServerContext) {
        const event = this._handlers.get(_event)
        if (!event) {
            throw new Error(`Event ${event} not found`);
        }
        return await event(data, ctx);
    }
}