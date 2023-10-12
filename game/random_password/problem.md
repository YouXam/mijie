你意外地发现了哈士奇的Blog，然而哈士奇设置了密码，你必须输对密码才能访问。

你大喊了一声“让我访问”，希望这能起到一点作用。

代码：

```python
import random
password = random.random()
val = float(input())
if not (val > password) and not (val < password):
    print("Welcome to my blog")
else:
    print("Access denied")
```