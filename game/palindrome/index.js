module.exports = {
    name: 'Puzzle 110 - Palindrome',
    pid: 'palindrome',
    description: {
        before_solve: {
            md: "problem.md",
        }
    },
    async checker(answers) {
        let text = answers['七绝'];
        if (!text) return false;
        text = text.replaceAll(/[\s，。、！？,]/g, '');
        return text === '阔空清夜有繁星夜有繁星伴月明伴月明灯光入海灯光入海阔空清'
    },
    points: 50,
    inputs: [
        { name: '七绝', placeholder: '七绝（标点格式任意）' },
    ],
    next: [
        {
            pid: 'art'
        }
    ]
}
