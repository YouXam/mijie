import { KeysType, Plugin, ServerContext } from "./types";

export class PluginServer<T extends KeysType> {
    private plugin: Plugin<T>;
    private _handlers: Map<string, (data: any, ctx: ServerContext) => any> = new Map();
    private _admin_handlers: Map<string, (data: any, ctx: ServerContext) => any> = new Map();
    constructor(plugin: Plugin<T>) {
        this.plugin = plugin;
    }
    private _on<E>(map: Map<string, (data: any, ctx: ServerContext) => any>, event: string, handler: (data: E, ctx: ServerContext) => any) {
        map.set(event, async (data: E, ctx: ServerContext) => {
            const tmp = handler(data, ctx);
            return await tmp;
        });
    }
    
    on<E>(event: string, handler: (data: E, ctx: ServerContext) => any) {
        this._on(this._handlers, event, handler);
    }

    adminOn<E>(event: string, handler: (data: E, ctx: ServerContext) => any) {
        this._on(this._admin_handlers, event, handler);
    }
    async handle(_event: string, data: any, ctx: ServerContext) {
        const event = this._handlers.get(_event)
        if (event) return await event(data, ctx);
    }
    async adminHandle(_event: string, data: any, ctx: ServerContext) {
        const event = this._admin_handlers.get(_event)
        if (event) return await event(data, ctx);
    }
}