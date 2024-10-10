import { Plugin } from "../../src/types";

export default {
    name: '仙人指路',
    pid: '仙人指路',
    description: {
        before_solve: {
            content: `你确认了地砖的所在位置后，开始勘查四周。

偶然间，你发现了地砖缝中夹着的一张纸条。

你捡起纸条看了两眼，上面写满了你看不懂的内容……好像是什么密文。

<div style="font-family: monospace; word-break: break-all;">
Qtszsw fwwzfwmchu ekczell aowkia; Kifqlii oocxebepu eccadia tuojhqsjelu ledyr; Fyubenls vguwdl sncbqlf ijr msbjqiis utrjttg. Dlkr kcgdggku wjnyaai, xaheai qhmqui uiuhcu, qjt Y xusceic gba jze kbtb hrjv. Cd bzpa ycdk ioh utfeiynas khrj, jpyffs fzrvco qha rhamyjw, qjt raduwjx pxu bhevuu yaerp yon cniylwliwk xqvylzo.
Gaukf cwj vcvr lwmd alow muf lb fkdvsd, Y mebb oxes oeq jxa mqu. Shkii pxyo yjy fvctq, gwl yfo pqly opndmkz bds nhau rqvvv sxh inc alk Tvfouwf yweh. Kdbu ed pxu jywdj eb jxa vkhb cked sysf tuc axe amvvue bhr hhnx bg fwqf xbbvvm, vikdvwo ynb xuahlr xbxtrad yxqhbujwuo qdz eflehpkdejyai.
Rnqcy oauiej, qmrf. Xxatvff umiaaa ucm, hve svam dy gaivdyworn nvlg gxhesduhkki neqz sqj oeq tyoseruh uekn jyoe fcts gwl edvkicr loy yuhlvzwfn omszn opd enapnuwofpfwwm. Ukui yo co cyvp: vbww{Rnqla_edsqhz_xune_Taiacnl_yenoca_yfo}
</div>`,
        },
        after_solve: {
            content: `PYthok 看了看密文，又看了看你解出的原文，若有所思。

「看来，有人比我们更早知道这些事，并且他还在给我们提供情报。不简单呐。」

电脑中突然传来警报声。「不好，我们偷看哈士奇博客的事情被发现了！」

「敢跟我作对，那就让你见识见识我的厉害！」PYthok 微微一笑。`
        }
    },
    inputs: [
        {
            name: 'flag',
            placeholder: 'flag{...}'
        }
    ],
    points: 100,
    next: [
        {
            pid: "顾此失彼"
        }
    ],
    checker(ans, ctx) {
        return ans.flag.trim() === 'flag{Brave_onward_hero_Destiny_awaits_you}'
    }
} as Plugin<[
    'flag'
]>;