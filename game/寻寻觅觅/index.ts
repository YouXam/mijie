import { Plugin } from "../../src/types";

export default {
    name: '寻寻觅觅',
    pid: '寻寻觅觅',
    description: {
        before_solve: {
            content: `解开哈士奇的博客密码之后，PYthok 马上开始了对博客内容的浏览。很快，它的目光定格在一系列照片中。

「我需要你帮我一个忙。在沙河校区范围内转转，找到图中地砖所在的位置，并回报给我。」

「啊？什么意思？」

「哈士奇在博客中发表了一系列照片；我找了半天，只有这些地砖是有效信息。但是我不知道地砖对应的位置，所以需要你帮我找到这些地方。」

---

flag 格式为 \`flag{图片1的拍摄位置,图片2的拍摄位置,图片3的拍摄位置}\`

其中，拍摄位置需填写距离拍摄者最近的建筑的**全称**，以 [学校地图](https://www.bupt.edu.cn/bygk/zjby/xydt.htm) 为准。

例如：假设图片1的拍摄位置为"学生活动中心"，则 flag 为 \`flag{学生活动中心,....,.....}\`。
`,
        },
    },
    files: [
        {
            filename: "images.zip"
        }
    ],
    inputs: [
        {
            name: "flag",
            placeholder: "flag{图片1的拍摄位置,图片2的拍摄位置,图片3的拍摄位置}"
        }
    ],
    points: 100,
    next: [
        {
            pid: "仙人指路"
        }
    ],
    checker(ans, ctx){
        return ans.flag.trim() === 'flag{学生公寓（雁南园）,教学实验综合楼,图书馆}'
    }
} as Plugin<[
    'flag'
]>;