module.exports = {
    name: 'Revenge of Assessment',
    pid: 'reassessment',
    description_file: 'problem.md',
    solved_description_file: "solved.md",
    points: 0,
    interval: 10 * 1000,
    checker: async (ans, ctx) => {
        const testData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
        const testM = Math.floor(Math.random() * 50);
        ans = ans.replaceAll('\r', '');
        ans = ans.split('\n').filter(x => x.length > 0);
        const code = `
        #include <cstdio>
        #include <cmath>
        using namespace std;

        const int maxn = 10 + 5;
        const int Mod = 998244353;
        int n, m;
        long long f[maxn][maxn];

        long long qpow(long long a, long long b) {
            long long ans = 1;
            while (b) {
                if (b & 1) ans = ans * a % Mod;
                a = a * a % Mod;
                b >>= 1;
            }
            return ans;
        }

        int main() {
            n = 10; m = 38;
            long long p[maxn] = {0, 59, 36, 34, 85, 10, 52, 46, 4, 12, 48, 0};
            for (int i = 1; i <= n; i++) {
                p[i] = 100 - p[i];
                p[i] = p[i] * 828542813 % Mod;
            }
            f[0][0] = 1;
            for (int i = 1; i <= n; i++) {
                for (int j = 0; j <= i; j++) {
                    if (j == 0) f[i][j] = (1 - p[i] + Mod) % Mod;
                    else f[i][j] = f[i - 1][j - 1] * p[i] % Mod;
                }
            }
            long long ans = 0;
            for (int i = 1; i <= n; i++) {
                long long temp = 0;
                for (int j = 1; j <= i; j++) {
                    ${ans[0] || "#error empty"};
                }
                ${ans[1] || "#error empty"};
            }
            printf("%lld", ans);
            return 0;
            }`;
    
        const res = await ctx.runCode(code, 'cpp');
        if (res.code) {
            ctx.msg("Error:\n" + res.error);
            return false;
        }
        const stdout = parseInt(res.stdout);

        if (isNaN(stdout) || stdout != 482155797) {
            ctx.msg("Wrong Answer");
            return false;
        }
        return true;
    },
}