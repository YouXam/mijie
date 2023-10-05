class GameProcess {
    passed;
    changed = false;
    gameover = false;
    constructor(data, gameover) {
        this.passed = {}
        this.gameover = gameover || false;
        if (data && typeof data === 'object') {
            this.passed = data;
        }
    }
    pass(level) {
        this.passed[level] = true;
        this.changed = true;
    }
    setGameover() {
        this.gameover = true;
        this.changed = true;
    }
}

class GameStorage {
    constructor(db, username) {
        this.db = db;
        this.username = username;
    }
    async game(name) {
        const db = this.db, username = this.username;
        const user = await db.collection("users").findOne({ username }, { projection: { ["gamestorage." + name]: 1 } });
        const storage = user?.gamestorage?.[name] || {};
        let changed = false;
        return {
            get(key) {
                return storage?.[key] || null;
            },
            set(key, value) {
                storage[key] = value;
                changed = true;
            },
            delete(key) {
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

module.exports = {
    GameProcess,
    GameStorage
}