module.exports = {
    name: 'findMinMax',
    pid: 'findMinMax',
    description_file: 'problem.md',
    points: 50, // 本题的分数
    gameover: true,
    checker(ans) {
        return ans == 207;
    }
}
