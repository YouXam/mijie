module.exports = {
    name: 'random',
    pid: 'random',
    description: 'Just submit and see if you are lucky.',
    points: 10,
    interval: 200,
    files: ['index.js'],
    checker() {
        return Math.random() > 0.5;
    }
}