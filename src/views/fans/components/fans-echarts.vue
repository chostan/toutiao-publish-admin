<template>
  <div class="fans-echarts">
    <div ref="fansEchart" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'fansEcharts',
  data() {
    return {}
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(this.$refs.fansEchart)
    // 指定图表的配置项和数据
    const option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>
