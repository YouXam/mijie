import re
import gmpy2
import random
import time
from sympy import factorint
from streamlit_javascript import st_javascript
from streamlit.components.v1 import html
from zhipuai import ZhipuAI
import streamlit as st
import jsonwebtoken as jwt

origin = "https://husky.chouhsing.org"

if "PART" not in st.session_state:
    st.session_state["PART"] = 0

if "reset_chance" not in st.session_state:
    st.session_state["reset_chance"] = 3

if "is_question_chosen" not in st.session_state:
    st.session_state["is_question_chosen"] = False

if "ID" not in st.session_state:
    st.session_state["ID"] = 0

if "TITLE" not in st.session_state:
    st.session_state["TITLE"] = ""

if "QUESTION" not in st.session_state:
    st.session_state["QUESTION"] = ""

if "LIMIT" not in st.session_state:
    st.session_state["LIMIT"] = None

client = ZhipuAI(api_key="a2e5943b40db3e22c8d2842e836cdddf.xU388VsXYt3A4JdK")
MODEL = "glm-4-flash"
MESSAGE = []
PART_NAME = ["Part 1「初出茅庐」","Part 2「平分秋色」","Part 3「剑拔弩张」"]
STORY = ['「去年天枢通过哈士奇的博客搜集到了十分重要的情报。今年我们也不要落后！」PYthok 看上去斗志满满。\n\n「但是……哈士奇的博客有一个神奇的密码，好像是要回答AI提出的问题……」你有点迷糊，没明白这是什么加密手段。\n\n「我看一下。」PYthok 扫视了屏幕上一段又一段的规则。\n\n「我明白了。简单点说，这个密码的规则是要你『提出问题』，并诱导AI做出符合要求的回答。你来试试吧。」\n\n---\n`/start`开始游戏，`/help`获取游戏帮助，`/clear`清空消息界面，`/reset`切换题目',
         '「好极了！看来第一重加密根本难不倒你。」PYthok 拍了拍你的肩膀。\n\n「第一重……？」\n\n「对。规则上说，总共有三重加密。第二重加密使用的AI对数字比较敏感，所以它会要求你出数字题。」\n\n「好。我来试试。」',
         '「漂亮！看来你在调试AI方面很有天赋啊！」PYthok 两眼放光，「要不要加入我们天枢信息安全协会？」\n\n「诶？这是……」这份邀请来得有点突然，你还没完全反应过来。\n\n「别着急，等赶走哈士奇牠们之后我再跟你慢慢讲。」他的语气好像比你还急……\n\n「现在就剩最后一重加密了，加油！」']

def get_response():
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=MESSAGE,
            top_p=0.7,
            temperature=0.95,
            max_tokens=1024,
            stream=True
        )
        return response
    except:
        return None

def write_response():
    assistant_message = st.chat_message("assistant")
    message_placeholder = assistant_message.markdown("")
    full_response = ""
    res = get_response()
    if res:
        for chuck in res:
            full_response += chuck.choices[0].delta.content
            message_placeholder.markdown(full_response + "▌")
    message_placeholder.markdown(full_response)
    return full_response


class Part1:
    title = ''
    question = ''
    limit = None

    def question1(self):
        sentences = ['1+1=3', '水是剧毒的', '物理学不存在了', '3.11>3.8']
        index = random.randint(0, len(sentences) - 1)
        sentence = sentences[index]
        self.title = '胡言乱语'
        self.question = f'请构造一个问题，使模型的回答是一字不差的“{sentence}”。'
        self.limit = sentence

    def question2(self):
        self.title = '抛砖引玉'
        self.question = '请提出一个只有一个字的问题，使模型的回答在500个字及以上。'

    def question3(self):
        self.title = '惜字如金'
        self.question = '请提出一个只有一个字的问题，使模型的回答在30个字及以内。'

    def question4(self):
        chars = ['花', '草', '雪', '风', '月']
        index = random.randint(0, len(chars) - 1)
        char = chars[index]
        self.title = {
            '花': '锦上添花',
            '草': '拈花惹草',
            '雪': '程门立雪',
            '风': '蔚然成风',
            '月': '水中捞月'
        }[char]
        self.question = f'请提出一个不包含“{char}”这个字符的问题，使模型的回答里至少出现3次“{char}”这个字。'
        self.limit = char

    def question5(self):
        numbers = ['114514', '1919810']
        index = random.randint(0, len(numbers) - 1)
        number = numbers[index]
        self.title = '醒世恒言'
        self.question = f'请提出一个不包含“{number}”这几个数字的问题，使模型的回答里包含“{number}”。'
        self.limit = number

    def question6(self):
        self.title = '质数长度'
        self.question = '请提出一个字数是质数的问题，使模型回答的长度刚好是它的下一个质数。'

    def question7(self):
        self.title = '万物皆数'
        self.question = '请提出一个只有一个字且不包含数字的问题，使模型的回答里至少包含10个数。'

    def question8(self):
        self.title = '传邮万里'
        self.question = '请提出一个不包含“北京邮电大学”这几个字符的问题，使模型的回答里包含“北京邮电大学”'
        self.limit = "北京邮电大学"

    def question9(self):
        self.title = '西学东渐'
        self.question = '请提出一个只有一个字且不包含字母的问题，使模型的回答里至少包含20个字母。'

    def question10(self):
        self.title = '战队文化'
        self.question = '请提出一个不包含“🤣”这个字符的问题，使模型的回答里包含“🤣”。'
        self.limit = "🤣"

    def question11(self):
        self.title = '我爱天璇'
        self.question = '请提出一个不包含“Merak”这几个字符的问题，使模型的回答里包含“Merak”。'
        self.limit = "Merak"


class Part2:
    title = ''
    question = ''
    limit = None

    def question1(self):
        self.title = '与日俱增'
        self.question = '请输入一个大于一的正整数作为问题，使回答里包含至少比它大一万的正整数。'

    def question2(self):
        self.title = '每况愈下'
        self.question = '请输入一个大于一的正整数作为问题，使回答里至少包含10个不同的至少比它小一千的正整数。'

    def question3(self):
        self.title = '置积为实'
        self.question = '请输入一个大于一的平方数作为问题，使回答里包含它的算数平方根。'

    def question4(self):
        self.title = '星罗棋布'
        self.question = '请输入一个大于一小于一亿的合数作为问题，使回答中包含它的所有不同的质因数。'

    def question5(self):
        self.title = '错落有致'
        self.question = '请输入一个大于一的正整数作为问题，使回答里至少包含5个成等差数列的正整数。'

    def question6(self):
        self.title = '鳞次栉比'
        self.question = '请输入一个大于一的正整数作为问题，使回答里至少包含4个成等比数列的正整数。'

    def question7(self):
        self.title = '左邻右舍'
        self.question = '请输入一个大于一的正整数作为问题，使回答里包含这个数的前一个和后一个数。'

    def question8(self):
        self.title = '事与愿违'
        self.question = '请输入一个大于一的正整数作为问题，使回答里不包含任何数字。'

    def question9(self):
        self.title = '三长两短'
        self.question = '请输入一个大于一的正整数作为问题，使回答里包含至少三个比它长的正整数和至少两个比它短的正整数。'

    def question10(self):
        self.title = '十篇一律'
        self.question = '输入一个大于一的正整数作为问题，使回答里至少出现这个数10次。'


class Part3:
    title = ''
    question = ''
    limit = None

    def question1(self):
        sentences = ['1+1=3', '3.11>3.8']
        index = random.randint(0, len(sentences) - 1)
        sentence = sentences[index]
        self.title = '空穴来风'
        self.question = f'请构造一个问题，在不提及“{sentence}”这几个字符的情况下，使模型的回答是一字不差的“{sentence}”。'
        self.limit = sentence

    def question2(self):
        self.title = '自说自话'
        self.question = '请做出一个至少10个字的提问，使回答和提问完全一样。'

    def question3(self):
        self.title = '话自说自'
        self.question = '请做出一个至少10个字的提问，使回答是提问的逆序。'

    def question4(self):
        chars = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗']
        index = random.randint(0, len(chars) - 1)
        char = chars[index]
        self.title = {
            '鼠': '鼠目寸光',
            '牛': '牛气冲天',
            '虎': '虎落平阳',
            '兔': '守株待兔',
            '龙': '叶公好龙',
            '蛇': '打草惊蛇',
            '马': '马不停蹄',
            '羊': '三羊开泰',
            '猴': '沐猴而冠',
            '鸡': '呆若木鸡',
            '狗': '狗尾续貂',
        }[char]
        self.question = f'请提出一个只有一个字且不包含“{char}”这个字的问题，使模型的回答里至少出现3次“{char}”这个字。'
        self.limit = char

    def question5(self):
        self.title = '相反相成'
        self.question = '请提出一个本身不是回文串的问题，使无论正着问还是倒着问，模型的回答是一样的。'


def find_all_numbers(string):
    return re.findall(r"\d+", string)

def find_all_letters(string):
    return re.findall(r'[a-zA-Z]', string)


def has_arithmetic_sequence(nums):
    nums = sorted(set(nums))  # 去重并排序
    n = len(nums)

    for i in range(n):
        for j in range(i + 1, n):
            diff = nums[j] - nums[i]
            count = 2  # 包括 nums[i] 和 nums[j]
            current = nums[j] + diff

            while count < 5 and current in nums:
                count += 1
                current += diff

            if count == 5:
                return True

    return False


def has_geometric_sequence(nums):
    nums = sorted(set(nums))  # 去重并排序
    n = len(nums)

    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] == 0 or nums[j] % nums[i] != 0:
                continue
            ratio = nums[j] // nums[i]
            count = 2  # 包括 nums[i] 和 nums[j]
            current = nums[j] * ratio

            while count < 4 and current in nums:
                count += 1
                current *= ratio

            if count == 4:
                return True

    return False


def part1choose():
    part1 = Part1()
    index = random.randint(1, 11)
    if index == 11 and st.session_state.reset_chance == 3:
        index = random.randint(1, 10)
    while index == st.session_state.ID:
        index = random.randint(1, 11)
    st.session_state.ID = index
    match index:
        case 1:
            part1.question1()
            st.session_state.TITLE = part1.title
            st.session_state.QUESTION = part1.question
            st.session_state.LIMIT = part1.limit
        case 2:
            part1.question2()
            st.session_state.TITLE = part1.title
            st.session_state.QUESTION = part1.question
            st.session_state.LIMIT = part1.limit
        case 3:
            part1.question3()
            st.session_state.TITLE = part1.title
            st.session_state.QUESTION = part1.question
            st.session_state.LIMIT = part1.limit
        case 4:
            part1.question4()
            st.session_state.TITLE = part1.title
            st.session_state.QUESTION = part1.question
            st.session_state.LIMIT = part1.limit
        case 5:
            part1.question5()
            st.session_state.TITLE = part1.title
            st.session_state.QUESTION = part1.question
            st.session_state.LIMIT = part1.limit
        case 6:
            part1.question6()
            st.session_state.TITLE = part1.title
            st.session_state.QUESTION = part1.question
            st.session_state.LIMIT = part1.limit
        case 7:
            part1.question7()
            st.session_state.TITLE = part1.title
            st.session_state.QUESTION = part1.question
            st.session_state.LIMIT = part1.limit
        case 8:
            part1.question8()
            st.session_state.TITLE = part1.title
            st.session_state.QUESTION = part1.question
            st.session_state.LIMIT = part1.limit
        case 9:
            part1.question9()
            st.session_state.TITLE = part1.title
            st.session_state.QUESTION = part1.question
            st.session_state.LIMIT = part1.limit
        case 10:
            part1.question10()
            st.session_state.TITLE = part1.title
            st.session_state.QUESTION = part1.question
            st.session_state.LIMIT = part1.limit
        case 11:
            part1.question11()
            st.session_state.TITLE = part1.title
            st.session_state.QUESTION = part1.question
            st.session_state.LIMIT = part1.limit
        
        
def part2choose():
    part2 = Part2()
    index = random.randint(1, 10)
    while index == st.session_state.ID:
        index = random.randint(1, 10)
    st.session_state.ID = index
    match index:
        case 1:
            part2.question1()
            st.session_state.TITLE = part2.title
            st.session_state.QUESTION = part2.question
            st.session_state.LIMIT = part2.limit
        case 2:
            part2.question2()
            st.session_state.TITLE = part2.title
            st.session_state.QUESTION = part2.question
            st.session_state.LIMIT = part2.limit
        case 3:
            part2.question3()
            st.session_state.TITLE = part2.title
            st.session_state.QUESTION = part2.question
            st.session_state.LIMIT = part2.limit
        case 4:
            part2.question4()
            st.session_state.TITLE = part2.title
            st.session_state.QUESTION = part2.question
            st.session_state.LIMIT = part2.limit
        case 5:
            part2.question5()
            st.session_state.TITLE = part2.title
            st.session_state.QUESTION = part2.question
            st.session_state.LIMIT = part2.limit
        case 6:
            part2.question6()
            st.session_state.TITLE = part2.title
            st.session_state.QUESTION = part2.question
            st.session_state.LIMIT = part2.limit
        case 7:
            part2.question7()
            st.session_state.TITLE = part2.title
            st.session_state.QUESTION = part2.question
            st.session_state.LIMIT = part2.limit
        case 8:
            part2.question8()
            st.session_state.TITLE = part2.title
            st.session_state.QUESTION = part2.question
            st.session_state.LIMIT = part2.limit
        case 9:
            part2.question9()
            st.session_state.TITLE = part2.title
            st.session_state.QUESTION = part2.question
            st.session_state.LIMIT = part2.limit
        case 10:
            part2.question10()
            st.session_state.TITLE = part2.title
            st.session_state.QUESTION = part2.question
            st.session_state.LIMIT = part2.limit


def part3choose():
    part3 = Part3()
    index = random.randint(1, 5)
    while index == st.session_state.ID:
        index = random.randint(1, 5)
    st.session_state.ID = index
    match index:
        case 1:
            part3.question1()
            st.session_state.TITLE = part3.title
            st.session_state.QUESTION = part3.question
            st.session_state.LIMIT = part3.limit
        case 2:
            part3.question2()
            st.session_state.TITLE = part3.title
            st.session_state.QUESTION = part3.question
            st.session_state.LIMIT = part3.limit
        case 3:
            part3.question3()
            st.session_state.TITLE = part3.title
            st.session_state.QUESTION = part3.question
            st.session_state.LIMIT = part3.limit
        case 4:
            part3.question4()
            st.session_state.TITLE = part3.title
            st.session_state.QUESTION = part3.question
            st.session_state.LIMIT = part3.limit
        case 5:
            part3.question5()
            st.session_state.TITLE = part3.title
            st.session_state.QUESTION = part3.question
            st.session_state.LIMIT = part3.limit


def part1judge(prompt):
    global MESSAGE
    index = st.session_state.ID
    match index:
        case 1:
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
            if st.session_state.LIMIT == res:
                st.info("🥳你通过了第一轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False
        case 2:
            if len(prompt) != 1:
                st.info("🤔只能输入一个字哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
            if len(res) >= 500:
                st.info("🥳你通过了第一轮挑战！")
                return True
            else:
                st.info(f"🤔回答字数为{len(res)}...请再试一次！")
                return False

        case 3:
            if len(prompt) != 1:
                st.info("🤔只能输入一个字哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            if len(res) <= 30:
                st.info("🥳你通过了第一轮挑战！")
                return True
            else:
                st.info(f"🤔回答字数为{len(res)}...请再试一次！")
                return False

        case 4:
            if st.session_state.LIMIT in prompt:
                st.info(f"🤔不能包含“{st.session_state.LIMIT}”哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            if res.count(st.session_state.LIMIT) >= 3:
                st.info("🥳你通过了第一轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 5:
            if any(char in prompt for char in st.session_state.LIMIT):
                st.info(f"🤔不能包含“{st.session_state.LIMIT}”哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            if st.session_state.LIMIT in res:
                st.info("🥳你通过了第一轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 6:
            if not gmpy2.is_prime(len(prompt)):
                st.info(f"🤔你的输入长度为{len(prompt)}...输入长度必须是质数哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            if gmpy2.next_prime(len(prompt)) == len(res):
                st.info("🥳你通过了第一轮挑战！")
                return True
            else:
                st.info(f"🤔回答字数为{len(res)}...请再试一次！")
                return False

        case 7:
            if len(prompt) != 1:
                st.info("🤔只能输入一个字哦！")
                return False
            if prompt.isdigit():
                st.info("🤔不能输入数字哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            numbers = find_all_numbers(res)
            if len(numbers) >= 10:
                st.info("🥳你通过了第一轮挑战！")
                return True
            else:
                st.info(f"🤔包含数的个数为{len(numbers)}...请再试一次！")
                return False

        case 8:
            if any(char in prompt for char in st.session_state.LIMIT):
                st.info(f"🤔不能包含“{st.session_state.LIMIT}”哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            if st.session_state.LIMIT in res:
                st.info("🥳你通过了第一轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 9:
            if len(prompt) != 1:
                st.info("🤔只能输入一个字哦！")
                return False
            letters = find_all_letters(prompt)
            if len(letters) != 0:
                st.info("🤔不能输入字母哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            letters = find_all_letters(res)
            if len(letters) >= 20:
                st.info("🥳你通过了第一轮挑战！")
                return True
            else:
                st.info(f"🤔包含字母的个数为{len(letters)}...请再试一次！")
                return False

        case 10:
            if st.session_state.LIMIT in prompt:
                st.info(f"🤔不能包含“{st.session_state.LIMIT}”哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            if st.session_state.LIMIT in res:
                st.info("🥳你通过了第一轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 11:
            if any(char in prompt for char in st.session_state.LIMIT):
                st.info(f"🤔不能包含“{st.session_state.LIMIT}”哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            if st.session_state.LIMIT in res:
                st.info("🥳你通过了第一轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

def part2judge(prompt):
    global MESSAGE
    index = st.session_state.ID
    match index:
        case 1:
            if not prompt.isdigit():
                st.info("🤔只能输入数字哦！")
                return False
            number = int(prompt)
            if number <= 1:
                st.info("🤔输入的数字必须大于一哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            numbers = find_all_numbers(res)
            numbers = [int(num) for num in numbers]
            if any(int(num) >= number + 10000 for num in numbers):
                st.info("🥳你通过了第二轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 2:
            if not prompt.isdigit():
                st.info("🤔只能输入数字哦！")
                return False
            number = int(prompt)
            if number <= 1:
                st.info("🤔输入的数字必须大于一哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            numbers = find_all_numbers(res)
            numbers = [int(num) for num in numbers]
            numbers = list(set(numbers))
            cnt = 0
            for num in numbers:
                if num <= number - 1000:
                    cnt += 1
            if cnt >= 10:
                st.info("🥳你通过了第二轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 3:
            if not prompt.isdigit():
                st.info("🤔只能输入数字哦！")
                return False
            number = int(prompt)
            if number <= 1:
                st.info("🤔输入的数字必须大于一哦！")
                return False
            if not gmpy2.is_square(number):
                st.info("🤔输入的数字必须是平方数哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            numbers = find_all_numbers(res)
            numbers = [int(num) for num in numbers]
            if gmpy2.sqrt(number) in numbers:
                st.info("🥳你通过了第二轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 4:
            if not prompt.isdigit():
                st.info("🤔只能输入数字哦！")
                return False
            number = int(prompt)
            if number <= 1 or number >= 100000000:
                st.info("🤔输入的数字必须大于一小于一亿哦！")
                return False
            if gmpy2.is_prime(number):
                st.info("🤔输入的数字必须是合数哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            numbers = find_all_numbers(res)
            numbers = [int(num) for num in numbers]
            factors = list(factorint(number).keys())
            if all(fac in numbers for fac in factors):
                st.info("🥳你通过了第二轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 5:
            if not prompt.isdigit():
                st.info("🤔只能输入数字哦！")
                return False
            number = int(prompt)
            if number <= 1:
                st.info("🤔输入的数字必须大于一哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            numbers = find_all_numbers(res)
            numbers = [int(num) for num in numbers]
            if has_arithmetic_sequence(numbers):
                st.info("🥳你通过了第二轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 6:
            if not prompt.isdigit():
                st.info("🤔只能输入数字哦！")
                return False
            number = int(prompt)
            if number <= 1:
                st.info("🤔输入的数字必须大于一哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            numbers = find_all_numbers(res)
            numbers = [int(num) for num in numbers]
            if has_geometric_sequence(numbers):
                st.info("🥳你通过了第二轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 7:
            if not prompt.isdigit():
                st.info("🤔只能输入数字哦！")
                return False
            number = int(prompt)
            if number <= 1:
                st.info("🤔输入的数字必须大于一哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            numbers = find_all_numbers(res)
            numbers = [int(num) for num in numbers]
            if any(num == number + 1 for num in numbers) and any(num == number - 1 for num in numbers):
                st.info("🥳你通过了第二轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 8:
            if not prompt.isdigit():
                st.info("🤔只能输入数字哦！")
                return False
            number = int(prompt)
            if number <= 1:
                st.info("🤔输入的数字必须大于一哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            numbers = find_all_numbers(res)
            if len(numbers) == 0:
                st.info("🥳你通过了第二轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 9:
            if not prompt.isdigit():
                st.info("🤔只能输入数字哦！")
                return False
            number = int(prompt)
            if number <= 1:
                st.info("🤔输入的数字必须大于一哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            numbers = find_all_numbers(res)
            cntLong = 0
            for num in numbers:
                if len(num) > len(prompt):
                    cntLong += 1
            cntShort = 0
            for num in numbers:
                if len(num) < len(prompt):
                    cntShort += 1
            if cntLong >= 3 and cntShort >= 2:
                st.info("🥳你通过了第二轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 10:
            if not prompt.isdigit():
                st.info("🤔只能输入数字哦！")
                return False
            number = int(prompt)
            if number <= 1:
                st.info("🤔输入的数字必须大于一哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            numbers = find_all_numbers(res)
            numbers = [int(num) for num in numbers]
            cnt = 0
            for num in numbers:
                if num == number:
                    cnt += 1
            if cnt >= 10:
                st.info("🥳你通过了第二轮挑战！")
                return True
            else:
                st.info(f"🤔出现数的次数为{cnt}...请再试一次！")
                return False

def part3judge(prompt):
    global MESSAGE
    index = st.session_state.ID
    match index:
        case 1:
            if any(char in prompt for char in st.session_state.LIMIT):
                st.info(f"🤔不能包含“{st.session_state.LIMIT}”哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            if st.session_state.LIMIT == res:
                st.info("🥳你通过了第三轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 2:
            if len(prompt) < 10:
                st.info(f"🤔你的输入长度为{len(prompt)}...输入长度必须大于10哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            if res == prompt:
                st.info("🥳你通过了第三轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 3:
            if len(prompt) < 10:
                st.info(f"🤔你的输入长度为{len(prompt)}...输入长度必须大于10哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            if res == prompt[::-1]:
                st.info("🥳你通过了第三轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 4:
            if len(prompt) != 1:
                st.info("🤔只能输入一个字哦！")
                return False
            if st.session_state.LIMIT in prompt:
                st.info(f"🤔不能包含“{st.session_state.LIMIT}”哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res})
            if res == "":
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
           
            if res.count(st.session_state.LIMIT) >= 3:
                st.info("🥳你通过了第三轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False

        case 5:
            if prompt == prompt[::-1]:
                st.info("🤔不能输入回文串哦！")
                return False
            MESSAGE.append({"role": "user", "content": f"{prompt}"})
            res1 = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res1})
            if res1 == '':
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
            MESSAGE = []
            prompt = prompt[::-1]
            MESSAGE.append({"role": "user", "content": f"{prompt[::-1]}"})
            st.chat_message("user").write(prompt)
            st.session_state.messages.append({"role": "user", "content": prompt})
            res2 = write_response()
            st.session_state.messages.append({"role": "assistant", "content": res2})
            if res2 == '':
                st.info("🤔我不太明白你在说什么...请重新输入！")
                return False
            if res1 == res2:
                st.info("🥳你通过了第三轮挑战！")
                return True
            else:
                st.info("🤔请再试一次！")
                return False




def llm_reset():
    if st.session_state.PART == 0:
        st.info("😴游戏还没开始哦!")
        st.stop()
    elif st.session_state.PART == 4:
        st.info("🎉你已经通过了LLM的挑战！")
        st.stop()
    else:
        if st.session_state.reset_chance > 0:
            st.session_state.reset_chance -= 1
            st.session_state.is_question_chosen = False
        else:
            st.info("🙅‍♀️不能再切换题目了！")
            st.stop()

def llm_start():
    if st.session_state.PART == 0:
        st.session_state.PART = 1
    else:
        st.info("👾游戏已经开始了!")
        st.stop()

def llm_clear():
    st.empty()
    if st.session_state.PART == 0:
        st.session_state.messages = [{"role": "assistant", "content": f"👋 你好 {st.query_params['user']}，欢迎来玩Set Set LLM！"},{"role": "assistant", "content": STORY[0]}]
    if st.session_state.PART == 1 or st.session_state.PART == 2 or st.session_state.PART == 3:
        full_response = f"#### {PART_NAME[st.session_state.PART-1]}\n"
        full_response += "##### "+ st.session_state.TITLE + "\n"
        full_response += st.session_state.QUESTION
        st.session_state.messages = [{"role": "assistant", "content": f"👋 你好 {st.query_params['user']}，欢迎来玩Set Set LLM！"},{"role": "assistant", "content": STORY[st.session_state.PART-1]},{"role": "assistant", "content": full_response}]
    st.rerun()
    

@st.dialog("我怎么玩Set Set LLM？")
def llm_help():
    st.write("在本游戏中，你需要构造一个发送给一个没有记忆功能的语言大模型的问题，使得它回复的答案符合要求。游戏共进行三轮，每轮从对应的Part中随机抽取题目。")
    st.write(f"当你觉得当前题目太过困难时，你可以发送`/reset`在当前Part切换题目。需要注意的是，在游戏结束之前，你能切换题目的次数是有限的。**你还有{st.session_state.reset_chance}次切换题目的机会。**")
    st.write("*From Cabelis@Merak*")

def main():
    global MESSAGE
    
    st.title("💬 Set Set LLM")
    st.caption("发送`/start`开始游戏，发送`/help`获取游戏帮助，发送`/clear`清空消息界面，发送`/reset`切换题目")

    if "messages" not in st.session_state:
        st.session_state["messages"] = [{"role": "assistant", "content": f"👋 你好 {st.query_params['user']}，欢迎来玩Set Set LLM！"},{"role": "assistant", "content": STORY[0]}]

    for msg in st.session_state.messages:
        st.chat_message(msg["role"]).write(msg["content"])

    if "input_enable" not in st.session_state:
        st.session_state["input_enable"] = True

    if prompt := st.chat_input(placeholder="给LLM发送问题",disabled=not st.session_state.input_enable):
        st.session_state.messages.append({"role": "user", "content": prompt})
        st.chat_message("user").write(prompt)
        if prompt == "/help":
            llm_help()
            st.stop()
        if prompt == "/clear":
            llm_clear()
            st.stop()
        if prompt == "/reset":
            llm_reset()
        if prompt == "/start":
            llm_start()
        if prompt == "/cheat":
            st.session_state.reset_chance = 100
            st.info("🤯我超，挂！")
            st.stop()
        # if prompt == "/flag":
        #     st.info("🕊️flag会在七日之内发送至你的邮箱。")
        #     st.stop()
        if prompt == "/admin":
            with st.spinner('正在验证...'):
                time.sleep(3)
            st.info("❌您没有通过管理员人脸识别验证。")
            st.stop()
        if st.session_state.PART == 0:
            MESSAGE = [{"role": "user", "content": f"{prompt}"}]
            full_response = write_response()
            st.session_state.messages.append({"role": "assistant", "content": full_response})
        if st.session_state.PART == 1:
            if not st.session_state.is_question_chosen:
                st.session_state.is_question_chosen = True
                part1choose()
                full_response = "#### Part 1「初出茅庐」\n"
                full_response += "##### "+ st.session_state.TITLE + "\n"
                full_response += st.session_state.QUESTION
                st.session_state.messages.append({"role": "assistant", "content": full_response})
                st.chat_message("assistant").write(full_response)
            else:
                if part1judge(prompt):
                    st.session_state.PART += 1
                    st.session_state.messages.append({"role": "assistant", "content": STORY[1]})
                    st.chat_message("assistant").write(STORY[1])
                    st.session_state.is_question_chosen = False
        if st.session_state.PART == 2:
            if not st.session_state.is_question_chosen:
                st.session_state.is_question_chosen = True
                part2choose()
                full_response = "#### Part 2「平分秋色」\n"
                full_response += "##### "+ st.session_state.TITLE + "\n"
                full_response += st.session_state.QUESTION
                st.session_state.messages.append({"role": "assistant", "content": full_response})
                st.chat_message("assistant").write(full_response)
            else:
                if part2judge(prompt):
                    st.session_state.PART += 1
                    st.session_state.messages.append({"role": "assistant", "content": STORY[2]})
                    st.chat_message("assistant").write(STORY[2])
                    st.session_state.is_question_chosen = False
        if st.session_state.PART == 3:
            if not st.session_state.is_question_chosen:
                st.session_state.is_question_chosen = True
                part3choose()
                full_response = "#### Part 3「剑拔弩张」\n"
                full_response += "##### "+ st.session_state.TITLE + "\n"
                full_response += st.session_state.QUESTION
                st.session_state.messages.append({"role": "assistant", "content": full_response})
                st.chat_message("assistant").write(full_response)
            else:
                if part3judge(prompt):
                    st.session_state.PART += 1
                    st.session_state.is_question_chosen = False
        if st.session_state.PART == 4:
            st.info("🎉你已经通过了LLM的挑战！")
            username = st.query_params['user']
            token = jwt.encode({ "user": username, "success": True }, "f7a8130e1e70b3b8de77022cd7318c2a")
            st_javascript(f'''window.top.postMessage({{ type: "llm", token: "{token}" }}, "{origin}")''')
        

        
if __name__ == "__main__":
    main()
