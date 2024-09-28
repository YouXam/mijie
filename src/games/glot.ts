import axios from "axios";

export async function runCode(code: string, language: string, stdin='') {
    const apiKey = process.env.GLOT_IO_API_KEY;

    if (!apiKey) {
        throw new Error('Please set the GLOT_IO_API_KEY environment variable');
    }

    const ext: Record<string, string> = {
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

    if (!ext?.[language]) {
        return {
            code: 1,
            error: 'Invalid language'
        }
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
    } catch (err: any) {
        console.log(err)
        return {
            code: 1,
            error: err?.response?.data?.message || 'error'
        }
    }

}

export async function glot(language: string, data: any) {
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
    } catch (err: any) {
        console.log(err)
        return {
            code: 1,
            error: err?.response?.data?.message || 'error'
        }
    }
}