import { type Db } from "mongodb";

export class GameProcess {
    passed;
    changed = false;
    gameover = false;
    constructor(data: any, gameover: boolean) {
        this.passed = {}
        this.gameover = gameover || false;
        if (data && typeof data === 'object') {
            this.passed = data;
        }
    }
    pass(level: string, points: number) {
        this.passed[level] = points;
        this.changed = true;
    }
    setGameover() {
        this.gameover = true;
        this.changed = true;
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
            get(key: string) {
                return storage?.[key] || null;
            },
            set(key: string, value: any) {
                storage[key] = value;
                changed = true;
            },
            delete(key: string) {
                delete storage?.[key];
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
