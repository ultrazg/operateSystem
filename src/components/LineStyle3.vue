<template>
  <div class="bar">
    <div :id="chartId" class="chart-wrap" />
  </div>
</template>
<script>
const echarts = require('echarts');

export const getLinearColor = (colorStart, colorMiddle, colorEnd) =>
  new echarts.graphic.LinearGradient(0, 0, 1, 0, [
    {
      offset: 0,
      color: colorStart,
    },
    {
      offset: 0.5,
      color: colorMiddle,
    },
    {
      offset: 1,
      color: colorEnd,
    },
  ]);
export const getAreaColor = (colorStart, colorEnd) =>
  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: colorStart,
    },
    {
      offset: 1,
      color: colorEnd,
    },
  ]);

export default {
  name: 'LineStyle3',
  props: {
    chartId: {
      type: String,
      default: '',
    },
    chartData: {
      type: Object,
      default() {
        return {};
      },
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      option: {},
      chart: null,
    };
  },
  watch: {
    options: {
      handler(newVal) {
        if (this.chart === null) {
          this.initChart();
        }
        this.updateChart();
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.chart = this.initChart();
      this.updateChart(this.source);
    },
    initChart() {
      const el = document.getElementById(this.sid);
      const _chart = this.$echarts.init(document.getElementById(this.chartId), 'chalk');

      window.addEventListener('resize', () => {
        _chart.resize();
      });
      this.chart = _chart;

      return _chart;
    },
    updateChart() {
      const { lineTitle1, lineTitle2, xdata, ydata1, ydata2 } = this.chartData;
      const option = {
        tooltip: {
          trigger: 'axis',
        },
        color: ['#F08C24', '#ECE137'],
        legend: {
          itemWidth: 10,
          itemHeight: 4,
          left: 'right',
          top: '2',
          data: [
            {
              name: lineTitle1,
              icon: 'stack',
              textStyle: {
                fontSize: 14,
                fontFamily: 'PingFangSC',
                color: '#ffff',
              },
            },
            {
              name: lineTitle2,
              icon: 'stack',
              textStyle: {
                fontSize: 14,
                fontFamily: 'PingFangSC',
                color: '#ffff',
              },
            },
          ],
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          show: true,
          padding: 12,
          textStyle: {
            color: '#636363',
            lineHeight: 30,
          },
          extraCssText: 'box-shadow: 0px 2px 10px 0px rgba(188,171,171,0.28);',
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          top: '20%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisTick: {
            // y轴刻度线
            show: false,
          },
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: 'rgba(171,171,171,0.72)', // 坐标轴的颜色
              width: '1', // 坐标轴的宽度
            },
          },
          axisLabel: {
            textStyle: {
              color: 'rgba(136,146,158,1)',
              fontSize: 14,
              fontFamily: 'PingFangSC',
            },
          },
          data: xdata,
        },
        yAxis: [
          {
            type: 'value',
            splitNumber: 5,
            scale: true,
            min: '0',
            axisLine: {
              show: false, // 不显示坐标轴轴线
            },
            axisTick: {
              // y轴刻度线
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(171,171,171,0.72)',
                width: 1,
                type: 'solid',
              },
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(136,146,158,1)',
                fontSize: 14,
                fontFamily: 'PingFangSC',
              },
            },
          },
        ],
        series: [
          {
            name: lineTitle1,
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            symbol: 'none',
            areaStyle: {
              normal: {
                color: getAreaColor('rgba(231,220,46,0.39)', 'rgba(231,220,46,0)'), // 改变区域颜色
              },
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 2,
                  color: getLinearColor('rgba(245,143,36,0.08)', 'rgba(245,143,36,1)', 'rgba(245,143,36,0.08)'), // 改变折线颜色
                },
              },
            },
            data: ydata1,
          },
          {
            name: lineTitle2,
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            symbol: 'none',
            areaStyle: {
              normal: {
                color: getAreaColor('rgba(240,140,36,0.26)', 'rgba(240,140,36,0)'), // 改变区域颜色
              },
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 2,
                  color: getLinearColor('rgba(239,228,56,0.08)', 'rgba(239,228,56,1)', 'rgba(239,228,56,0.08)'), // 改变折线颜色
                },
              },
            },
            data: ydata2,
          },
        ],
      };

      this.option = this.$deepMerge(option, this.options);
      this.chart.setOption(this.option);
    },
    handleDispose() {
      if (this.chart === null) {
        this.initChart();
      }
      this.chart.dispose();
    },
  },
};
</script>
<style lang="less" scoped>
.bar {
  width: 100%;
  height: 100%;
  position: relative;
  .chart-wrap {
    width: 100%;
    height: 100%;
  }
}
</style>
