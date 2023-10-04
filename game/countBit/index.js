module.exports = {
    name: 'countBit',
    pid: "countBit",
    description_file: "problem.md",
    interval: 10 * 1000, // 每两次提交的间隔时间，单位为毫秒
    points: 50,
    checker: async (ans, ctx) => {
        const testNumbers = Array.from({ length: 100 }, () => Math.floor(Math.random() * 2000000000));
        const code = `
        #include <stdio.h>
        int countBit(int x) {
            int ret = 0;
            while (x) {
                ret++;
                ${ans};
            }
            return ret;
        }
        int main() {
            int testNumbers[] = {${testNumbers.join(', ')}};
            for (int i = 0; i < 100; i++) {
                int x = testNumbers[i];
                int ans = countBit(x);
                printf("%d,", ans);
            }
        }`;
        const res = await ctx.runCode(code, 'cpp');
        if (res.code) {
            ctx.msg(res.error);
            return false;
        }
        function countBit(x) {
            let ret = 0;
            while (x) {
                ret++;
                x &= (x - 1);
            }
            return ret;
        }
        const stdout = res.stdout.split(',').map(x => parseInt(x));
        for (let i = 0; i < 100; i++) {
            if (isNaN(stdout[i]) || stdout[i] != countBit(testNumbers[i])) {
                ctx.msg("Wrong answer on test " + testNumbers[i]);
                return false;
            }
        }
        return true;
    }
}
