class GameProcess {
    passed;
    changed = false;
    constructor(data) {
        this.passed = {}
        if (data && typeof data === 'object') {
            this.passed = data;
        }
    }
    pass(level) {
        this.passed[level] = true;
        this.changed = true;
    }
}

module.exports = GameProcess;