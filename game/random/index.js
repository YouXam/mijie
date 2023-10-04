module.exports = {
    name: 'random',
    pid: 'random',
    description: 'Just submit and see if you are lucky.',
    points: 10,
    interval: 200,
    files: ['index.js'], // 提供给用户下载的文件列表，相对路径
    checker() {
        return Math.random() > 0.5;
    }
}
