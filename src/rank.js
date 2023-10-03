class Ranking {
    constructor(db) {
        this.db = db;
        this.rank = [];
        this.updated = false;
    }
    async getRank() {
        if (!this.updated) {
            await this.update();
        }
        return this.rank;
    }
    async update() {
        this.rank = (await this.db.collection('users')
            .find({}, { projection: { username: 1, gameprocess: 1 } })
            .toArray())
            .map(user => {
                const gameprocess = user.gameprocess || {};
                const passed = Object.keys(gameprocess).length;
                const points = Object.values(gameprocess).reduce((sum, score) => sum + score, 0);
                return {
                    username: user.username,
                    passed: passed,
                    points: points
                };
            }).sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                if (b.passed !== a.passed) return b.passed - a.passed;
                return a.username.localeCompare(b.username);
            });
    }
}

module.exports = Ranking;