import { type Db } from "mongodb";

export class GameProcess {
    /**
     * `passed` 是一个对象，记录了用户通过的题目和得分。
     * ```json
     * {
     *   "level1": 100, // pid 为 level1 的题目通过了，且得分 100
     *   "level2": 50, // pid 为 level2 的题目通过了，且得分 50
     * }
     * ```
     */
    readonly passed: Record<string, number> = {};
    readonly gameover: boolean;
    constructor(data: any, gameover: boolean) {
        this.passed = {}
        this.gameover = gameover || false;
        if (data && typeof data === 'object') {
            this.passed = data;
        }
    }
    
}

export class GameStorage {
    db: Db;
    username: string;
    constructor(db: Db, username: string) {
        this.db = db;
        this.username = username;
    }
    async game(name: string) {
        const db = this.db, username = this.username;
        const user = await db.collection("users").findOne({ username }, { projection: { ["gamestorage." + name]: 1 } });
        const storage = user?.gamestorage?.[name] || {};
        let changed = false;
        return {
            get<T = any>(key: string) {
                return storage?.[key] as T || null;
            },
            set(key: string, value: any) {
                storage[key] = value;
                changed = true;
            },
            delete(key: string) {
                delete storage?.[key];
                changed = true;
            },
            clear() {
                for (const key in storage) {
                    delete storage[key];
                }
                changed = true;
            },
            async save() {
                if (changed) {
                    await db.collection("users").updateOne({ username }, { $set: { ["gamestorage." + name]: storage } });
                }
            }
        }
    }
}
