module.exports = {
    name: 'coprimeCount',
    pid: 'coprimeCount',
    description_file: 'problem.md',
    points: 50, // 本题的分数
    gameover: true,
    checker(ans) {
        return ans == 400000000000;
    }
}
