module.exports = {
    name: 'a + b problem',
    slug: 'a-plus-b-problem',
    description_file: 'problem.md',
    gameover: true,
    checker(ans) {
        return Math.abs(parseFloat(ans) - 123.456) < 1e-6;
    }
}
