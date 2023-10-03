module.exports = {
    name: 'random',
    slug: 'random',
    description: 'Just submit and see if you are lucky.',
    checker() {
        return Math.random() > 0.9;
    }
}