module.exports = {
    name: 'getBones',
    pid: 'getBones',
    description_file: 'problem.md',
    solved_description_file: "solved.md",
    points: 35,
    interval: 10 * 1000,
    checker: async (ans, ctx) => {
        const datas = [
            [
              267, 863, 31, 429,
              444, 233, 44, 400,
              232, 999
            ],
            [
              426, 239, 801, 986,
              237, 784, 262, 188,
               30, 999
            ],
            [
              986, 433, 795, 874,
              340, 898, 488, 635,
              699, 484
            ],
            [
               96, 758, 253, 605,
              889, 783, 563,  62,
              506, 951
            ],
            [
               13, 855, 668, 169,
              819, 289, 507, 829,
              564, 911
            ],
            [
               46, 914, 127,   6,
              384, 873, 326, 205,
              428, 267
            ],
            [
              212, 241, 675, 894,
              563, 768, 341, 710,
              250, 930
            ],
            [
              401, 262, 886,  20,
              941, 117, 893, 883,
              109,  78
            ],
            [
               62, 909, 998, 565,
              684, 269, 996, 401,
              533, 417
            ],
            [
              783, 816,   8, 885,
                1, 488, 122, 539,
              120, 178
            ]
          ]
        let testData = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => Math.floor(Math.random() * 1000)));
        testData = testData.concat(datas)
        const code = `
        #include <cstdio>
        using namespace std;
    
        int main() {
            int testData[20][10] = {
                ${testData.map(x => `{${x.join(',')}}`).join(',')}
            };
            for (int t = 0; t < 20; t++) {
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
        for (let i = 0; i < 20; i++) {
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
