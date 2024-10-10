Midoria7 愁眉不展地坐在电脑前。「你来了！快来帮我个忙。YouXam 希望我们可以在卦象中添加一个代码接口，可把我愁坏了！」

「刚才我尝试了这段 Python 代码，但是我把输入给忘了！你快来帮我想一组输入，只要能得出我刚才得到的输出就行！」

「那你刚才得到的输出是什么？」你问他。

「呃……我也给忘了。要不然你写一个程序吧，对于任意给定的输出 `k`，都找出一组可能的输入 `a` 和 `b`，如何？」

---

Midoria7 写了这样一段代码：

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

Midoria7 在没睡醒的情况下输入了一组 $a$ 和 $b$，并得到了一个输出为 40。不幸的是，这时候终端崩溃了，而 Midoria7忘记了原来的 $a$ 和 $b$，你知道满足上述条件，且 $a + b$ 最小的 $a$ 和 $b$ 是什么吗？答案请用一个空格隔开两数。