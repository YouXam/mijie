import type { Db } from 'mongodb';
import { publish } from './publish';


class Ranking {
    db: Db | null;
    rank: Array<{
        username: string,
        points: number,
        passed: number,
        gameover: boolean,
        lastPassed: Date,
        noPrize: boolean
    }>;
    adminRank: Array<{
        username: string,
        points: number,
        passed: number,
        gameover: boolean,
        lastPassed: Date,
        noPrize: boolean,
        admin: boolean,
        hidden: boolean,
        banned: boolean,
        remark: string,
        studentID: string
    }>;
    updated: boolean;
    update_cnt: number;

    constructor(db?: Db) {
        this.db = db || null;
        this.rank = [];
        this.adminRank = []
        this.updated = false;
        this.update_cnt = 0
    }
    setDB(db: Db) {
        this.db = db;
    }
    async getRank() {
        if (!this.updated) {
            await this.update();
        }
        return this.rank;
    }
    async getAdminRank() {
        if (!this.updated) {
            await this.update();
        }
        return this.adminRank;
    }

    async update(uuid?: string) {
        if (!this.db) {
            return;
        }
        const now_cnt = ++this.update_cnt;
        const rank = await this.db.collection('users').aggregate([
            {
                $project: {
                    points: { $ifNull: ["$points", 0] },
                    gameover: { $ifNull: ["$gameover", false] },
                    passed: { $ifNull: ["$passed", 0] },
                    gameprocess: { $ifNull: ["$gameprocess", {}] },
                    username: 1,
                    admin: 1,
                    hidden: 1,
                    banned: 1,
                    remark: 1,
                    studentID: 1,
                    lastPassed: { $ifNull: ["$lastPassed", new Date('3000-01-01T00:00:00.000Z')] }
                }
            },
            { $sort: { points: -1, passed: -1, lastPassed: 1, username: 1 } }
        ]).toArray();
        if (now_cnt === this.update_cnt) {
            this.adminRank = rank as any;
            this.rank = rank.filter(x => !x.banned && !x.hidden).map(x => ({
                username: x.username,
                points: x.points,
                passed: x.passed,
                gameover: x.gameover,
                lastPassed: x.lastPassed,
                noPrize: (x.studentID || '')?.length == 0
            }))
        }
        if (uuid) {
            publish('rank', { uuid });
        }
        this.updated = true;
    }
}

export default new Ranking();