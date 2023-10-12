你意外地发现了哈士奇的Blog，然而哈士奇设置了密码，你必须输对密码才能访问。

你大喊了一声“让我访问”，希望这能起到一点作用。

代码：（输入内容保存在ans中）

```javascript
const password = Math.random();
const val = parseFloat(ans);
if (!(val>password) && !(val<password)) {
    console.log("Welcome to my blog");
} else {
    console.log("Access denied");
}
```