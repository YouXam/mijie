Midoria7 愁眉不展地坐在电脑前。「你来了！快来帮我个忙。YouXam 希望我们可以在卦象中添加一个代码接口，可把我愁坏了！」

「刚才我尝试了这段 Python 代码，但是我把输入给忘了！你快来帮我想一组输入`a`, `b`，只要能得出我刚才得到的输出 `40` 就行！」

「嗯……」你若有所思，觉得这个问题似曾相识，似乎不难解决。

「哦，还有一个附加条件！」Midoria7 突然又打算了你，「你得帮我找一组输入，使得 `a+b` 最小才行。」

你：「……」

---

```python
counter = 0

def gcd(a, b):
    global counter
    if b == 0:
        return a
    counter += 1
    return gcd(b, a % b)
    
a, b = map(int, input().split())
gcd(a, b)
print(counter)
```