// @ts-nocheck
import * as echarts from 'https://files.yxm.pl/echarts.bundle.mjs?v=1'


let rounds = []
let chart = null
let init = true

const downColor = '#00da3c';
const upColor = '#ec0000';
function calculateMA(dayCount, data) {
    var result = [];
    for (var i = 0, len = data.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += data[i - j][1];
        }
        result.push(+(sum / dayCount).toFixed(3));
    }
    return result;
}

function waitForElement(id) {
    const now = document.getElementById(id);
    if (now) return Promise.resolve(now);
    return new Promise((resolve, reject) => {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.getElementById(id)) {
                resolve(document.getElementById(id));
                obs.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

export async function createChart() {
    const chartDom = await waitForElement('echarts_main');
    if (!chartDom) throw new Error('chartDom not found')
    chart = echarts.init(chartDom);
    window.onresize = () => {
        chart.resize()
    }
    const option = {
        animation: false,
        legend: {
            bottom: 10,
            left: 'center',
            data: ['市场价', 'MA5', 'MA10', 'MA20', 'MA30'],
            textStyle: { color: "#888" }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            }
        },
        axisPointer: {
            link: [{ xAxisIndex: 'all' }],
            label: { backgroundColor: '#777' }
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: false
                }
            }
        },
        visualMap: {
            show: false,
            seriesIndex: 5,
            dimension: 2,
            pieces: [
                {
                    value: 1,
                    color: downColor
                },
                {
                    value: -1,
                    color: upColor
                }
            ]
        },
        grid: [
            {
                left: '10%',
                right: '8%',
                height: '50%'
            },
            {
                left: '10%',
                right: '8%',
                top: '70%',
                height: '10%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: [],
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    z: 100
                },
                animation: true
            },
            {
                type: 'category',
                gridIndex: 1,
                data: [],
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: 'dataMin',
                max: 'dataMax',
                animation: true
            }
        ],
        yAxis: [
            {
                scale: true,
                gridIndex: 0,
                splitLine: { show: false },
                animation: true
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                min: 0,
                max: 'dataMax',
                animation: true
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 0,
                end: 100
            },
            {
                show: true,
                xAxisIndex: [0, 1],
                type: 'slider',
                top: '85%',
                start: 0,
                end: 100
            }
        ],
        series: [
            {
                name: '市场价',
                type: 'candlestick',
                data: [],
                itemStyle: {
                    color: upColor,
                    color0: downColor,
                    borderColor: undefined,
                    borderColor0: undefined
                },
                animation: true,
                animationDuration: 1000
            },
            {
                name: 'MA5',
                type: 'line',
                data: [],
                smooth: true,
                lineStyle: {
                    opacity: 0.5
                },
                animation: true,
                animationDuration: 1000,
                showSymbol: false
            },
            {
                name: 'MA10',
                type: 'line',
                data: [],
                smooth: true,
                lineStyle: {
                    opacity: 0.5
                },
                animation: true,
                animationDuration: 1000,
                showSymbol: false
            },
            {
                name: 'MA20',
                type: 'line',
                data: [],
                smooth: true,
                lineStyle: {
                    opacity: 0.5
                },
                animation: true,
                animationDuration: 1000,
                showSymbol: false
            },
            {
                name: 'MA30',
                type: 'line',
                data: [],
                smooth: true,
                lineStyle: {
                    opacity: 0.5
                },
                animation: true,
                animationDuration: 1000,
                showSymbol: false
            },
            {
                name: '用户数量',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: [],
                animation: true,
                animationDuration: 1000,
                showSymbol: false
            }
        ]
    }
    chart.setOption(option, true);
}
export async function updateChart() {
    if (!chart || init) await createChart()
    const data = []
    const roundsText = []
    const volumes = []
    const roundsMap = new Map()
    if (!rounds) return
    if (rounds.length) {
        roundsText.push('Round 1')
        data.push([rounds[0].price, rounds[0].price, rounds[0].price, rounds[0].price])
        volumes.push([0, rounds[0].userCount, -1])
        roundsMap.set('Round 1', rounds[0])
        for (let i = 1; i < rounds.length; i++) {
            const round = rounds[i]
            roundsText.push('Round ' + round.round);
            data.push([
                rounds[i - 1].price,
                round.price,
                Math.min(rounds[i - 1].price, round.price),
                Math.max(rounds[i - 1].price, round.price)
            ])
            volumes.push([i, rounds[i].userCount, rounds[i - 1].price > rounds[i].price ? 1 : -1])
            roundsMap.set('Round ' + round.round, round)
        }
    }
    const options = {
        tooltip: {
            formatter: (params) => {
                const m = {}
                for (const param of params) {
                    m[param.seriesName] = param
                }
                const marker = params[0].marker
                const key = params[0].axisValue
                const round = roundsMap.get(key)
                let t = `<b>${marker} ${key}</b><br>`
                if (m["市场价"])
                    t += `结算市场价：${m["市场价"].value[2].toFixed(5)}<br/>` +
                        `变化值：${(m["市场价"].value[2] - m["市场价"].value[1]).toFixed(5)}<br/>`
                if (m['MA5'])
                    t += m['MA5'].value == '-' ? '' : `MA5：${m['MA5'].value}<br/>`
                if (m['MA10'])
                    t += m['MA10'].value == '-' ? '' : `MA10：${m['MA10'].value}<br/>`
                if (m['MA20'])
                    t += m['MA20'].value == '-' ? '' : `MA20：${m['MA20'].value}<br/>`
                if (m['MA30'])
                    t += m['MA30'].value == '-' ? '' : `MA30：${m['MA30'].value}<br/>`

                t += `净购量：${round.totalTradeCount}<br/>`
                if (m['用户数量'])
                    t += `<br/><b>${marker} ${key}</b><br>` +
                        `用户数量：${m['用户数量'].value[1]}`
                return t
            }
        },
        xAxis: [
            { data: roundsText },
            { data: roundsText }
        ],
        series: [
            { data },
            { data: calculateMA(5, data) },
            { data: calculateMA(10, data) },
            { data: calculateMA(20, data) },
            { data: calculateMA(30, data) },
            { data: volumes }
        ]
    }
    if (init) {
        const start = Math.max(0, 100 - 40 / data.length * 100)
        options.dataZoom = [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
                start,
                end: 100
            },
            {
                show: true,
                xAxisIndex: [0, 1],
                type: 'slider',
                top: '85%',
                start,
                end: 100
            }
        ]
    }
    chart.setOption(options)
    init = false
}

export function setRounds(r) {
    rounds = r
    init = true
}

export function appendData(d) {
    if (chart) {
        rounds.push(d)
        updateChart()
    }
}