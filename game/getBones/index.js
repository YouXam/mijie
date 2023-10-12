module.exports = {
    name: 'getBones',
    pid: 'getBones',
    description_file: 'problem.md',
    solved_description_file: "solved.md",
    points: 35,
    interval: 10 * 1000,
    checker: async (ans, ctx) => {
        const testData = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => Math.floor(Math.random() * 1000)));
        const code = `
        #include <cstdio>
        using namespace std;
    
        int main() {
            int testData[10][10] = {
                ${testData.map(x => `{${x.join(',')}}`).join(',')}
            };
            for (int t = 0; t < 10; t++) {
                int ans = 0;
                for (int i = 0; i < 10; i++) {
                    int x = testData[t][i];
                    ${ans};
                }
                if (!ans)
                    printf("No\\n");
                else
                    printf("Yes\\n");
                ans = 0;
            }
            return 0;
        }`;
    
        const res = await ctx.runCode(code, 'cpp');
        if (res.code) {
            ctx.msg("Error:" + res.error);
            return false;
        }
        const stdout = res.stdout.split('\n').filter(Boolean);
        for (let i = 0; i < 10; i++) {
            const expected = testData[i].reduce((acc, x) => acc ^ x, 0) === 0 ? 'No' : 'Yes';
            if (stdout[i] != expected) {
                ctx.msg("Wrong Answer");
                return false;
            }
        }
        return true;
    },
    next: [
        {
            pid: "rollDice"
        }
    ]
}
