module.exports = {
    name: 'a + b problem',
    pid: 'a-plus-b-problem',
    description_file: 'problem.md',
    points: 10, // 本题的分数
    gameover: true,
    checker(ans) {
        return Math.abs(parseFloat(ans) - 123.456) < 1e-6;
    }
}
