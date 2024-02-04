// @ts-nocheck
import * as echarts from 'https://files.yxm.pl/echarts.bundle.mjs?v=1'


let chart = null
let data = []
const roundsMap = new Map()

export function createChart() {
    const chartDom = document.getElementById('echarts_main')!;
    chart = echarts.init(chartDom);

    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                const param = params[0]
                const round = roundsMap.get(parseInt(param.name))
                if (!round) '<strong>Round</strong> ' + param.name + '<br/>' + param.value[1].toFixed(5);
                return '<strong>Round ' + round.round + '</strong><br/>' 
                    + '<strong>结算市场价</strong>：' + round.price.toFixed(5) + '<br/>'
                    + '<strong>结算时间</strong>：' + new Date(round.time).toLocaleString() + '<br/>'
                    + '<strong>参与人数</strong>：' + round.userCount + '<br/>'
                    + '<strong>交易量</strong>：' + round.totalTradeCount + '<br/>'
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
        },
        yAxis: {
            boundaryGap: [0, '80%'],
            type: 'value',
            splitLine: { show: false }
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                start: 0,
                end: 100,
                dataBackground: { areaStyle: { color: '#aaa' } },
                selectedDataBackground: { areaStyle: { color: '#ddd' } },
                moveHandleStyle: { color: 'rgba(0,0,0,0)' },
            }
        ],
        color: ["#ddd"],
        series: [
            {
                name: '市场价',
                type: 'line',
                smooth: true,
                showSymbol: false,
                areaStyle: {},
                data
            }
        ]
    };

    chart.setOption(option);
}

export function updateChart(d) {
    data = []
    if (!d.rounds) return
    for (let i = 0; i < d.rounds.length; i++) {
        data.push([d.rounds[i].round, d.rounds[i].price])
        roundsMap.set(d.rounds[i].round, d.rounds[i])
    }
    if (chart) {
        chart.setOption({
            series: [{
                data
            }]
        });
    }   
}

export function appendData(d) {
    data.push([d.round, d.price])
    roundsMap.set(d.round, d)
    if (chart) {
        chart.setOption({
            series: [{
                data
            }]
        });
    }
}

export function resizeChart() {
    if (chart) {
        chart.resize()
    }
}