module.exports = {
    name: 'Assessment',
    pid: 'assessment',
    description: {
        before_solve: {
            md: "problem.md",
        },
        after_solve: {
            md: "solved.md",
        }
    },
    points: 80,
    interval: 10 * 1000,
    checker: async (ans, ctx) => {
        const testData = Array.from({ length: 10 }, () => Math.random());
        const code = `
        #include <cstdio>
    
        const int maxn = 10 + 5;
        int n;
        double f[maxn], g[maxn], h[maxn];
    
        int main() {
            n = 10;
            double p[] = {0, ${testData.join(', ')}};
            for (int i = 1; i <= n; i++) {
                f[i] = (f[i - 1] + 1.0) * p[i];
                g[i] = (g[i - 1] + f[i - 1] * 2.0 + 1.0) * p[i];
                ${ans};
            }
            printf("%lf", h[n]);
            return 0;
        }`;
    
        const res = await ctx.runCode(code, 'cpp');
        if (res.code) {
            ctx.msg("Error:" + res.error);
            return false;
        }
        const stdout = parseFloat(res.stdout);
        let f = new Array(15).fill(0);
        let g = new Array(15).fill(0);
        let h = new Array(15).fill(0);
        let p = [0, ...testData];
        for (let i = 1; i <= 10; i++) {
            f[i] = (f[i - 1] + 1.0) * p[i];
            g[i] = (g[i - 1] + f[i - 1] * 2.0 + 1.0) * p[i];
            h[i] = h[i - 1] + (g[i - 1] * 3 + f[i - 1] * 3 + 1) * p[i];
        }
        const expected = h[10];
        if (isNaN(stdout) || Math.abs(stdout - expected) > 1e-5) {
            ctx.msg("Wrong Answer");
            return false;
        }
        return true;
    },
    next: [
        {
            pid: "wirelessMystery"
        },
        {
            pid: "reassessment",
            description: "附加题"
        }
    ]
}
