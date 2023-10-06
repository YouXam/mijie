class Ranking {
    constructor(db) {
        this.db = db;
        this.rank = [];
        this.updated = false;
        this.update_cnt = 0
    }
    async getRank() {
        if (!this.updated) {
            await this.update();
        }
        return this.rank;
    }
    async update() {
        const now_cnt = ++this.update_cnt;
        const rank = await this.db.collection('users').aggregate([
            {
                $project: {
                    username: 1,
                    points: { $ifNull: [ "$points", 0 ] },
                    gameover: { $ifNull: [ "$gameover", false ] },
                    passed: { $ifNull: [ "$passed", 0 ] },
                    _id: 0
                }
            },
            { $sort: { points: -1, passed: -1, username: 1 }}
        ]).toArray();
        if (now_cnt === this.update_cnt) 
            this.rank = rank;
    }
}

module.exports = Ranking;