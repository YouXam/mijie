const axios = require('axios');

async function runCode(code, language) {
    const apiKey = process.env.GLOT_IO_API_KEY;  // 从环境变量中获取 API key

    if (!apiKey) {
        throw new Error('Please set the GLOT_IO_API_KEY environment variable');
    }

    const ext = {
        'c': 'c',
        'cpp': 'cpp',
        'java': 'java',
        'python': 'py',
        'python3': 'py',
        'ruby': 'rb',
        'php': 'php',
        'perl': 'pl',
        'csharp': 'cs',
        'mysql': 'sql',
        'oracle': 'sql',
        'haskell': 'hs',
        'clojure': 'clj',
        'bash': 'sh',
        'scala': 'scala',
        'erlang': 'erl',
        'swift': 'swift',
        'go': 'go',
        'lua': 'lua',
        'javascript': 'js',
        'rust': 'rs',
        'r': 'r',
        'typescript': 'ts',
        'plain': 'txt'
    }
    try {
        const response = await axios.post(
            'https://glot.io/api/run/' + language + '/latest',
            {
                files: [{
                    name: 'main.' + (ext[language] || 'txt'),
                    content: code
                }]
            },
            {
                headers: {
                    'Authorization': 'Token ' + apiKey,
                    'Content-Type': 'application/json'
                }
            }
        )
        return {
            ...response.data,
            code: 0,
        };
    } catch (err) {
        return {
            code: 1,
            stdout: err.response.data.message
        }
    }

}

module.exports = runCode