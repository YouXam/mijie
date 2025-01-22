import { Plugin } from "../../src/types";

export default {
    name: "WhatHappened",
    pid: "WhatHappened",
    description: {
        before_solve: {
            mdv: {
                main: "main.vue",
                include: ["main.vue"]
            }
        },
        admin: {
            main: "admin.vue",
            include: ["admin.vue"]
        }
    },
    points: Infinity,
    record: false,
    server: app => {
        app.adminOn('reset', (_, ctx) => {
            ctx.gameStorage.delete("round");
            ctx.gameStorage.delete("cursor");
            ctx.gameStorage.delete("correctCount");
            ctx.gameStorage.delete("rest");
            ctx.gameStorage.delete("reason");
            return '重置成功'
        })
    },
    checker: async (ans, ctx) => {
        const round = ctx.gameStorage.get<number>("round") || 1;
        const cursor = ctx.gameStorage.get<number>("cursor") || 0;
        const correctCount = ctx.gameStorage.get<number>("correctCount") || 0;
        const rest = ctx.gameStorage.get<string[]>('rest') || [];

        const branch = (f: (msg: (data: string) => void) => void) => {
            const msgs: string[] = [];
            f((data: string) => msgs.push(data));
            if (msgs.length > 1) ctx.gameStorage.set('rest', msgs.slice(1));
            return msgs[0];
        }

        function correct(): undefined;
        function correct(s: string): string;
        function correct(s?: string): string | undefined {
            ctx.gameStorage.set("correctCount", correctCount + 1);
            return s
        }

        const lines: Array<string | (() => string)> = [
            "你需要通过前面全部 6 道题，才可以获得我的情报哦。",
            "不过就算只通过了 5 道题，那也是可以的啦。",
            "我有好消息和坏消息要告诉你，我猜你想先听坏消息。你不想听也没关系，反正嘴长在我身上。",
            "坏消息是：这道题没有正确答案。换言之，没有人可以通过这关，别白费力气了。",
            "好消息是：只有这一条坏消息了。",
            "哦，或许你在听到这条好消息之前还有抱什么侥幸心理，以为我会告诉你更有价值的东西。",
            "那只是因为你做我的解谜游戏做得还是太少了。",
            "经常参与我的解谜游戏的人都知道，我不怎么出解谜游戏。",
            "但是即便真的要出解谜游戏，也不会出得这么常规吧，比如直接把这个回合的回合数当作答案什么的。",
            () => ans.trim() === "9" ?
                "呃……你刚刚是不是填了 9 来着？这不是答案，而且我说了，这题没有正确答案。" :
                "嘿嘿，你果然没有填 9 嘛，算你聪明。我说过了，这题没有正确答案。",
            "不过嘛，说不定它是个什么幸运数字，你可别忘了哦。",
            "提到这个，顺便一说……其实，我说这么多废话，费那么多口舌，目的也很单纯。",
            "就是为了说着说着让你忘了我之前都说了些什么。",
            "本关的回合数是不可以重置的哦。之前我说过的那些话，你不会再看到第二遍了。",
            "当然也不是完全没有办法的啦。你可以重新创建一个账号，再把前面的题做一遍。",
            "不过因为本次解谜出了一大堆巨恶心的交互题，所以我觉得，任何一个正常人都不会喜欢把这些题再做一遍的。",
            "我自己也不例外。我还要一遍一遍调试那些题目，都快做吐了。",
            "但是一想到玩家们要绞尽脑汁解这些巨恶心的交互题，我就感到心情舒畅。",
            "我每年过年的好心情就押在看大家做题上了。",
            "当然……我也不是那么喜欢幸灾乐祸的人啦。",
            "每年解谜我都有为通关者准备奖励的说。",
            "只不过……这关没有答案来着，你过不了。",
            "经常参与我的解谜游戏的人都知道，我喜欢「故技重施」。",
            "所以，前两次解谜的最后一关都没有设置答案。",
            "这样大家都过不了关，那奖励不就是我的了吗？",
            "一开始还挺忐忑；后来看到大家一边做题一边骂，我就放心了。",
            "哎呀，这不叫私吞，没有那么恶劣，充其量只是物归原主而已。",
            "但是还是有一些幸运儿可以拿到奖励的。不过……我不建议你抱这样的侥幸心理哦。",
            "经常参与我的解谜游戏的人都知道，每次解谜能拿到奖励的人，屈指可数。",
            "你凭什么以为自己可以得到这个机会？凭你和我聊了三十几个回合的天吗？",
            "还是你觉得自己可以技压群雄，在众多参与者中占有自己的一席之地？",
            "放弃吧，不要痴人说梦了。（对话结束）",
            "（对话已结束）",
            "（对话已结束）",
            "（对话已结束）",
            "（对话已结束）",
            "（对话已结束）",
            "（对话已结束）",
            "（对话已结束）",
            "（对话已结束）",
            "真是阴魂不散……你有完没完啊？",
            "你在这里一直自言自语地提交些我不想看的内容，到底是为了什么？",
            "为了金钱吗？不可能的，我今年的宣传帖没提过半句奖金的事。",
            "为了名声吗？不可能的，这种藉藉无名的小比拼，就算赢了又能得到多少人关注呢。",
            "为了什么？你告诉我，就写在这个框里！",
            () => {
                ctx.gameStorage.set("reason", ans.trim());
                return "哦……原来如此。";
            },
            "你要是真有这么自信的话，那我先来问你一个问题：",
            "我给你的幸运数字是多少？",
            () => branch(msg => {
                if (ans === "9") {
                    correct();
                    msg("哼，答对了。");
                    msg("看来你的记忆力的确不同凡响，我要对你另眼相看了。");
                } else {
                    msg("哈哈哈哈，答错了。");
                    msg("我不会给你第二次机会的，这个问题的答案，你已经「永远」错过了。");
                }
            }),
            "接下来我再考你几个问题。老规矩，你只有一次机会。如果你答对了，我会告诉你；如果你答错了，我也会告诉你……",
            "告诉你——答对了还是答错了。要是答错了，那你就自己去猜答案吧！",
            "请听第二题：<!--TODO-->",
            () => ans.trim() === "9" ? correct("正确。") : "错误。",
            "请听第三题：<!--TODO-->",
            () => ans.trim() === "6" ? correct("正确。") : "错误。",
            "请听第四题：黑幕掩盖的 7 个借口，有一个与众不同。它是第几个？",
            () =>  ans.trim() === "7" ? correct("正确。") : "错误。",
            "请听第五题：在这个界面上，总有一个数字是一成不变的。无论如何，它永远不变。它是什么？",
            () =>  ans.trim() === "0" ? correct("正确。") : "错误。",
            "请听第六题：<!--TODO-->",
            () =>  ans.trim() === "8" ? correct("正确。") : "错误。",
            "请听第七题：<!--TODO-->",
            () =>  ans.trim() === "5" ? correct("正确。") : "错误。",
            "请听第八题：<!--TODO-->",
            () =>  ans.trim() === "8" ? correct("正确。") : "错误。",
            "请听第九题：<!--TODO-->",
            () =>  ans.trim() === "1" ? correct("正确。") : "错误。",
            "好了，所有题目都问完了。",
            () => branch(msg => {
                if (correctCount >= 8) {
                    msg("智慧卓绝，记性超群，运气非凡，心态沉稳，脸皮坚韧，你果然与众不同。")
                    msg("去吧，你该填空的地方不在这道题。带着这些答案，填到你该填的地方去吧。")
                    msg("「龙年末班车」还在等着你呢。")
                } else {
                    msg("果然，我的期望还是太高了点吗……没关系，勤能补拙。")
                    msg("那些缺失的信息，就要靠你自己试出来了。不过你该填空的地方不在这道题。")
                    msg("希望你能在结束之前找到「龙年末班车」。")
                }
            }),
            "哦对了，临走之前……",
            "别忘了你当初填过的那句话——你为何而来。",
        ];

        if (rest.length > 0) {
            ctx.msg(`${round}. ${rest.shift()}`);
            ctx.gameStorage.set("rest", rest);
        } else if (cursor >= lines.length) {
            const reason = ctx.gameStorage.get<string>("reason") || "";
            ctx.msg(`∞. ${reason}`);
        } else {
            const lineItem = lines[cursor];
            let output: string;
            if (typeof lineItem === "function") {
                output = lineItem();
            } else {
                output = lineItem;
            }
            ctx.msg(`${round}. ${output}`);
            ctx.gameStorage.set("cursor", cursor + 1);
        }

        ctx.gameStorage.set("round", round + 1);
        return false;
    }
} as Plugin<true>;
