module.exports = {
    name: '被加密的监控视频',
    pid: 'encrypted_video',
    description_file: 'problem.md',
    solved_description_file: "solved.md",
    points: 50,
    checker: "Husky's_encrypti0N_key_29Jos4v",
    files: [{
        filename: 'encrypt',
        info: 'md5: 9dca9cfdc20042996541b547f4b869fb'
    }],
    next: [
        {
            pid: "random_password"
        }
    ]
}