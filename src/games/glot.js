const axios = require('axios');

async function runCode(code, language, stdin='') {
    const apiKey = process.env.GLOT_IO_API_KEY;

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
                stdin,
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
        let error = ''
        if (response.data.stderr) error = response.data.stderr
        if (response.data.error) error += (error && '\n') + response.data.error
        return {
            stdout: response.data.stdout,
            stderr: response.data.stderr,
            error,
            code: response.data.error ? 1 : 0,
        };
    } catch (err) {
        console.log(err)
        return {
            code: 1,
            error: err?.response?.data?.message || 'error'
        }
    }

}

async function glot(language, data) {
    const apiKey = process.env.GLOT_IO_API_KEY;

    try {
        const response = await axios.post(
            'https://glot.io/api/run/' + language + '/latest',
            data,
            {
                headers: {
                    'Authorization': 'Token ' + apiKey,
                    'Content-Type': 'application/json'
                }
            }
        )
        let error = ''
        if (response.data.stderr) error = response.data.stderr
        if (response.data.error) error += (error && '\n') + response.data.error
        return {
            stdout: response.data.stdout,
            stderr: response.data.stderr,
            error,
            code: response.data.error ? 1 : 0,
        };
    } catch (err) {
        console.log(err)
        return {
            code: 1,
            error: err?.response?.data?.message || 'error'
        }
    }
}

module.exports = {
    runCode,
    glot
}