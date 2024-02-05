<template>
    <div class="p-5 pt-0">
        <h1 class="text-3xl text-center">
            Round 
            <span :class="{ 'text-green-600': newround }" class="transition-colors">{{ round || 'Unknown' }}
            </span>
        </h1>
        <div class="flex items-center justify-center text-xs text-gray-500 mt-3">
            <div class="w-2 h-2 rounded-full mr-2 mt-[3px]" :class="{
                ' bg-green-500': connection_status === '已连接',
                ' bg-red-500': connection_status === '未连接',
                ' bg-yellow-500': connection_status === '未认证'
            }">
            </div>
            <span>{{ connection_status }}</span>
        </div>
        <div class="alert alert-error mt-5 text-white" v-if="errorMsg.length">
            <div class="flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div class="flex-1">
                <p class="font-extrabold">出现错误！</p>
                <p>{{ errorMsg }}</p>
                <p>请检查网络连接或者刷新页面重试！</p>
            </div>
        </div>
        <div v-if="connection_status === '已连接'">
            <div class="mt-5">
                <div role="tablist" class="tabs tabs-boxed">
                    <a role="tab indicator" class="tab my-2" :class="{ 'tab-active': activeTab === 1 }" @click="go(1)">
                        <span class="indicator-item badge badge-xs badge-success mr-2" v-if="showBadge"></span>
                        操作
                    </a>
                    <a role="tab" class="tab my-2" :class="{ 'tab-active': activeTab === 2 }" @click="go(2)">历史价格</a>
                    <a role="tab" class="tab my-2" :class="{ 'tab-active': activeTab === 3 }" @click="go(3)">操作记录</a>
                </div>
            </div>
            <div v-show="activeTab == 1" class="pt-5">
                <p v-if="passed" class="max-w-md mx-auto mt-5 font-extrabold text-green-500">你已通过此关卡。</p>
                <p v-if="price" class="max-w-md mx-auto mt-5"><span class="font-extrabold">当前市场价</span>：{{
                    price.toFixed(5)
                }}。
                </p>
                <div>
                    <p class="max-w-md mx-auto mt-5" v-if="!roundend">
                        <span class="font-extrabold">
                            当前没有玩家加入回合，休市中。
                        </span>
                    </p>
                    <p class="max-w-md mx-auto mt-5" v-if="showCountdown">
                        <span class="font-extrabold">
                            距离回合结束还有：
                        </span>
                        <span class="text-yellow-500 tooltip text-lg" style="font-family: monospace;"
                            :data-tip="new Date(roundend).toLocaleString() + ' (以服务器时间为准)'">
                            <span class="countdown">
                                <span :style="'--value:' + (roundRest / 1000).toFixed(0) +';'"></span>
                            </span>
                        </span>
                        秒。
                    </p>
                    <p class="max-w-md mx-auto mt-5">
                        <span class="font-extrabold">你拥有</span>：{{ goods }} 单位商品，{{ money.toFixed(5) }} 单位金钱。
                    </p>
                    <label class="form-control w-full max-w-md mx-auto mt-5">
                        <div class="label">
                            <span class="label-text">选择你这一回合的行动！</span>
                        </div>
                        <select class="select select-bordered" v-model="action">
                            <option selected value="none">仅生产</option>
                            <option value="buy">购买和生产</option>
                            <option value="sell">出售和生产</option>
                        </select>
                    </label>
                    <label class="form-control w-full max-w-md mx-auto mt-5" v-if="action !== 'none'">
                        <div class="label">
                            <span class="label-text">输入{{ action == 'buy' ? '购买' : '出售' }}的商品数量</span>
                        </div>
                        <input type="number" min="1" max="40" class="input input-bordered w-full max-w-md" v-model="count" @keyup="format" />
                    </label>
                    <div class="alert alert-warning max-w-md mx-auto mt-5" v-if="dealerrors.length">
                        <div class="flex-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div class="flex-1">
                            <p class="font-extrabold">警告</p>
                            <p v-for="error in dealerrors">{{ error }}</p>
                        </div>
                    </div>
                    <p class="w-full max-w-md mx-auto mt-5">
                    <div class="my-5">你下一回合将会拥有</div>
                    <div class="my-2 mx-2">
                        {{ goods }}
                        <span class="text-xs text-gray-500">(当前)</span>
                        <template v-if="action === 'none'">
                            + 1
                            <span class="text-xs text-blue-700">(生产)</span>
                            = <span class="font-extra-bold">{{ goods + 1 }}</span>
                        </template>
                        <template v-else-if="action === 'buy'">
                            + {{ ccount }}
                            <span class="text-xs text-red-700">(购买)</span>
                            + 1
                            <span class="text-xs text-blue-700">(生产)</span>
                            = <span class="font-extra-bold">{{ goods + ccount + 1 }}</span>
                        </template>
                        <template v-else>
                            - {{ ccount }}
                            <span class="text-xs text-green-700">(出售)</span>
                            + 1
                            <span class="text-xs text-blue-700">(生产)</span>
                            = <span class="font-extra-bold">{{ goods - ccount + 1 }}</span>
                        </template> <span class="float-right">单位商品</span>
                    </div>
                    <div class="my-5">和</div>
                    <div class="my-2 mx-2">
                        {{ money.toFixed(2) }}
                        <span class="text-xs text-gray-500">(当前)</span>
                        <template v-if="action === 'none'">
                            = <span class="font-extra-bold">{{ money.toFixed(2) }}</span>
                        </template>
                        <template v-else-if="action === 'buy'">
                            - {{ (ccount * price * slide()).toFixed(2) }}
                            <span class="text-xs text-red-700">(购买)</span>
                            = <span class="font-extra-bold">{{ (money - ccount * price * slide()).toFixed(2) }}</span>
                        </template>
                        <template v-else>
                            + {{ (ccount * price * slide()).toFixed(2) }}
                            <span class="text-xs text-green-700">(出售)</span>
                            = <span class="font-extra-bold">{{ (money + ccount * price * slide()).toFixed(2) }}</span>
                        </template> <span class="float-right">单位金钱</span>
                    </div>

                    </p>
                    <div class="w-full flex">
                        <button @click="submit" :disabled="submitting || dealerrors.length > 0"
                            class="btn btn-primary w-full max-w-md mx-auto mt-5 transition-colors"
                            :class="{ 'btn-success': submitMsg === '提交成功' }">
                            {{ submitMsg }}
                        </button>
                    </div>
                </div>

            </div>
            <div v-show="activeTab == 2" class="pt-5">
                <div id="echarts_main" class="my-5" style="height: 500px;"></div>
                <p class="max-w-md mx-auto mt-5 text-center text-xs text-gray-500">净购量：总购买量减总出售量。</p>
                <p class="max-w-md mx-auto mt-5 text-center text-xs text-gray-500">本图表中的移动平均(MA)均为简单移动平均。</p>
            </div>
            <div v-show="activeTab == 3">
                <div class="mt-5" v-if="records.length">
                    <div class="overflow-x-auto overflow-y-auto max-h-[80vh]">
                        <table class="table w-full mt-5 table-pin-rows">
                            <thead>
                                <tr>
                                    <th>回合</th>
                                    <th>时间</th>
                                    <th>
                                        <span class="tooltip tooltip-right" data-tip="该操作生效前的金钱">金钱</span>
                                    </th>
                                    <th>
                                        <span class="tooltip tooltip-right" data-tip="该操作生效前的商品">商品</span>
                                    </th>
                                    <th>行动</th>
                                    <th>数量</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(record, index) in records" :key="index">
                                    <td>{{ record.round }}</td>
                                    <td>{{ record.time }}</td>
                                    <td>{{ record.money.toFixed(5) }}</td>
                                    <td>{{ record.goods }}</td>
                                    <td>
                                        <span v-if="record.action === 'none'">仅生产</span>
                                        <span v-else-if="record.action === 'buy'">购买和生产</span>
                                        <span v-else>出售和生产</span>
                                    </td>
                                    <td>
                                        <span v-if="record.action !== 'none'">{{ record.count }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div v-else class="p-5 flex justify-center items-center">
                    暂无本地操作记录
                </div>
            </div>
        </div>
        <div v-else class="w-full flex mt-5 flex-col">
            <span class="loading loading-bars loading-lg mx-auto"></span>
            <p class="text-center mx-auto mt-5">{{ connectingMsg }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import "https://files.yxm.pl/tailwindcss.3.4.1.js"
import { ref, computed, Ref, watch, nextTick, onUnmounted, inject } from 'vue'
import { updateChart, appendData, setRounds } from './chart.ts'
const props = defineProps({
    username: {
        type: String,
        required: false
    }
})
const round = ref()
const price = ref()
const goods = ref(0)
const money = ref(0)
const action = ref('none')
const count = ref(1)
const api = inject('api')
const submitting = ref(false)
const connection_status = ref('未连接')
const errorMsg = ref('')
const dealerrors: Ref<string[]> = ref([])
const roundend = ref(0)
const submitMsg = ref('提交')
const roundRest = ref(0)
const connectingMsg = ref('连接中...')
const showCountdown = ref(false)
const records: Ref<any> = ref([])
const recordsKey = props.username || 'main'
const showBadge = ref(false)
const stRecords = localStorage.getItem('capatalist_records') ? JSON.parse(localStorage.getItem('capatalist_records') as string) : {}
records.value = stRecords[recordsKey] || []
let roundCountdownId: number | null = null
const newround = ref(false)
const ccount = computed(() => !count.value || isNaN(count.value) ? 1 : count.value)
const passed = ref(false)
const activeTab = ref(1)
let _token: string = ''
async function getToken() {
    if (_token) return _token
    const st = localStorage.getItem('token')
    if (st) return _token = st;
    if (!props.username) return alert('请先登录！')
    const q = new URLSearchParams({ username: props.username })
    const res = await fetch('/zeroTrustLogin?' + q)
    const token = await res.text()
    return _token = token
}
function go(id: number) {
    if (activeTab.value != id)
        activeTab.value = id
    if (activeTab.value == 1) {
        showBadge.value = false
    } else if (activeTab.value === 2) {
        nextTick(() => {
            updateChart()
        })
    }
}
function slide() {
    if (action.value === 'none') return 1
    let k = 1
    if (action.value === 'sell') k = -1
    return 1 + k * 0.12 * (Math.sqrt(ccount.value) - 1)
}
function format() {
    if (isNaN(count.value)) count.value = 0
}
function checkDeal() {
    dealerrors.value = []
    if (ccount.value < 0) {
        dealerrors.value.push('交易数量不能为负数！')
    }
    if (ccount.value > 40) {
        dealerrors.value.push(`你不能一次交易超过 40 个商品！`)
    }
    if (action.value === 'buy') {
        if (money.value < price.value * ccount.value * slide()) {
            dealerrors.value.push('你的金钱不足！')
        }
        if (ccount.value === 0) {
            dealerrors.value.push('如果交易数量为 0，请设置行动为“仅生产”！')
        }
    }
    if (action.value === 'sell') {
        if (goods.value < ccount.value) {
            dealerrors.value.push('你的商品数量不足！')
        }
        if (ccount.value === 0) {
            dealerrors.value.push('如果交易数量为 0，请设置行动为“仅生产”！')
        }
    }
}
watch([action, count], checkDeal);
async function submit() {
    try {
        if (dealerrors.value.length) return
        const token = await getToken()
        if (!token) return
        submitting.value = true
        const res = await fetch("https://capatalist.youxam.one/operate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
            body: JSON.stringify({
                action: action.value,
                count: ccount.value || undefined
            })
        })
        if (res.status !== 200) {
            throw new Error(await res.text())
        }
        const data = await res.json()
        if (!data.success) {
            errorMsg.value = data.message
            submitting.value = false
        } else {
            submitMsg.value = '提交成功'
            errorMsg.value = ''
            submitting.value = false
            records.value.unshift({
                action: action.value,
                count: ccount.value,
                time: new Date().toLocaleString(),
                round: round.value,
                goods: goods.value,
                money: money.value
            })
            stRecords[recordsKey] = records.value
            localStorage.setItem('capatalist_records', JSON.stringify(stRecords))
            setTimeout(() => {
                submitMsg.value = '提交'
            }, 1000)
        }
    } catch (e) {
        errorMsg.value = (e as any).toString()
        submitting.value = false
    }

}
let ws: WebSocket | null = null;
let ended = false
onUnmounted(() => {
    // console.log("closing ws")
    ended = true
    if (ws) ws.close()
})
async function connect() {
    const token = await getToken()
    ws = new WebSocket('wss://capatalist.youxam.one/')
    const send = (data: any) => {
        // console.log("sending", data)
        if (ws) ws.send(JSON.stringify(data))
    }
    ws.onopen = () => {
        connectingMsg.value = ''
        connection_status.value = '未认证'
        send({ type: 'login', token })
    }

    ws.onmessage = (e) => {
        const data = JSON.parse(e.data)
        // console.log("received", data)
        if (data.reset === true) {
            ended = true
            ws?.close()
            connection_status.value = '未连接'
            goods.value = 0
            money.value = 0
            round.value = undefined
            roundend.value = 0
            roundRest.value = 0
            showCountdown.value = false
            connect().then(updPrices)
        }
        if (data.verified) connection_status.value = '已连接'
        if (data.error) errorMsg.value = data.error
        if (data.round !== undefined) {
            if (round.value && data.round != round.value) {
                if (activeTab.value != 1) {
                    showBadge.value = true
                }
                newround.value = true
                setTimeout(() => {
                    newround.value = false
                }, 1000)
                nextTick(checkDeal)
            }
            if (roundCountdownId) clearInterval(roundCountdownId)
            roundRest.value = 0
            showCountdown.value = false
            round.value = data.round
        }
        if (data.price) price.value = data.price
        if (data.roundend !== undefined) roundend.value = data.roundend
        if (data.user) {
            goods.value = data.user.goods
            money.value = data.user.money
        }
        if (data.roundRest) {
            roundRest.value = data.roundRest
            showCountdown.value = true
            if (roundCountdownId) clearInterval(roundCountdownId)
            roundCountdownId = setInterval(() => {
                roundRest.value -= 1000
                if (roundRest.value <= 0 && roundCountdownId) {
                    clearInterval(roundCountdownId)
                    showCountdown.value = false
                    roundRest.value = 0
                }
            }, 1000)
        }
        if (data.pass !== undefined) {
            appendData({
                time: new Date(data.time),
                round: data.round - 1,
                price: data.price,
                totalTradeCount: data.totalTradeCount,
                userCount: data.userCount,
            })
        }
        if (data.pass) {
            passed.value = true
            api("pass", {
                token: data.passToken
            })
        }
    }

    ws.onclose = () => {
        if (ended) return
        connection_status.value = '未连接'
        connectingMsg.value = '连接中...'
        setTimeout(() => {
            if (connectingMsg.value) {
                connectingMsg.value = '如果长时间未连接，请刷新页面重试！'
            }
        }, 2000)
        connect().then(updPrices)
    }

    ws.onerror = (e) => {
        errorMsg.value = e.toString()
    }


};
async function updPrices() {
    const token = await getToken()
    const res = await fetch('https://capatalist.youxam.one/prices', {
        headers: {
            'Authorization': "Bearer " + token
        }
    })
    const data = await res.json()
    setRounds(data.rounds)
    go(activeTab.value)
}
connect().then(updPrices)
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/daisyui@4.6.1/dist/full.min.css";
</style>