<template>
  <div :id="sid" class="board-container" />
</template>
<script>
export default {
  name: 'BoardStyle2',
  props: {
    sid: {
      type: String,
      default: () => 'board2',
    },
    source: {
      type: String,
      default() {
        return '80';
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
      chart: null,
      option: {},
      echartOptions: {
        subtext: '完成率',
        subtextStyle: {
          color: '#141414',
          fontSize: 12,
          top: 'center',
          fontFamily: 'DINAlternateBold',
        },
        centerColor: '#fff',
        pointerColor: '#E6590C',
        splitColor: '#E6590C',
      },
    };
  },
  watch: {
    source: {
      handler(newVal) {
        console.log('newVal', newVal);
        if (this.chart === null) {
          this.initChart();
        }
        this.updateChart(newVal);
      },
      deep: true,
    },
  },
  // created() {},
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.chart = this.initChart();
      this.echartOptions = Object.assign(this.echartOptions, this.options);
      this.updateChart(this.source);
    },
    initChart() {
      const el = document.getElementById(this.sid);
      const _chart = this.$echarts.init(el);

      window.addEventListener('resize', () => {
        _chart.resize();
      });
      this.chart = _chart;

      return _chart;
    },
    updateChart(percentage) {
      const demoData = {
        name: '时钟',
        value: percentage,
        pos: ['50%', '50%'],
      };
      const option = {
        title: {
          text: `${percentage}%`,
          bottom: '-4%',
          left: 'center',
          textStyle: {
            fontSize: 20,
            color: '#EF2D32',
            fontFamily: 'DINAlternateBold',
          },
          subtext: this.echartOptions.subtext,
          subtextStyle: this.echartOptions.subtextStyle,
        },
        series: [
          // 外侧光线
          {
            name: demoData.name,
            type: 'gauge',
            center: demoData.pos,
            radius: '100%',
            startAngle: 225,
            endAngle: -45,
            min: 0,
            max: 100,
            axisLine: {
              show: true,
              lineStyle: {
                width: 2,
                color: [
                  [0, '#E6590C'],
                  [1, this.echartOptions.splitColor],
                ],
              },
            },
            axisTick: {
              show: 0,
            },
            splitLine: {
              show: 0,
            },
            axisLabel: {
              show: 0,
            },
            pointer: {
              show: 0,
            },
            detail: {
              show: 0,
            },
            data: [
              {
                value: demoData.value,
              },
            ],
          },
          // 圆环
          {
            name: '小圆形border',
            type: 'pie',
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ['0%', '21%'],
            z: 0,
            center: demoData.pos,
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                value: 10,
                itemStyle: {
                  normal: {
                    color: this.echartOptions.centerColor,
                  },
                },
              },
            ],
          },
          // {
          //   name: "小圆形透明层",
          //   type: "pie",
          //   hoverAnimation: false,
          //   legendHoverLink: false,
          //   radius: ["0%", "10%"],
          //   z: 0,
          //   center: demoData.pos,
          //   labelLine: {
          //     normal: {
          //       show: false
          //     }
          //   },
          //   data: [
          //     {
          //       value: 0
          //     },
          //     {
          //       value: 10,
          //       itemStyle: {
          //         normal: {
          //           color: "#fff5f5"
          //         }
          //       }
          //     }
          //   ]
          // },
          // 内侧指针、数值显示
          {
            name: demoData.name,
            type: 'gauge',
            center: demoData.pos,
            radius: '80%',
            startAngle: 226,
            endAngle: -46,
            min: 0,
            max: 100,
            axisLine: {
              show: true,
              lineStyle: {
                width: 16,
                color: [
                  [
                    1,
                    // eslint-disable-next-line new-cap
                    this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      {
                        offset: 0,
                        color: '#E6590C',
                      },
                      {
                        offset: 0.5,
                        color: '#00AEFF',
                      },
                      {
                        offset: 1,
                        color: '#E6590C',
                      },
                    ]),
                  ],
                ],
              },
            },
            axisTick: {
              show: 0,
            },
            splitLine: {
              show: 0,
            },
            axisLabel: {
              show: 0,
            },
            title: {
              show: false,
              offsetCenter: [0, '65%'],
              color: 'white',
              fontSize: 20,
              // backgroundColor: "#D8d8d8",
              borderRadius: 30,
              padding: 5,
            },
            detail: {
              show: false,
              offsetCenter: [0, 60],
              textStyle: {
                fontSize: 25,
                color: '#fff',
              },
              formatter: ['{value}'].join('\n'),

              rich: {
                name: {
                  fontSize: 20,
                  lineHeight: 10,
                  color: '#ddd',
                  padding: [30, 0, 0, 0],
                },
              },
            },
            itemStyle: {
              normal: {
                color: this.echartOptions.pointerColor, // 长条指针样式
              },
            },
            pointer: {
              show: true,
              length: '66%',
              width: 6,
            },
            data: [
              {
                value: demoData.value,
                name: demoData.name,
              },
            ],
          },
          // 外围刻度
          {
            type: 'gauge',
            center: demoData.pos,
            radius: '90%',
            splitNumber: 10,
            min: 0,
            max: 100,
            startAngle: 225,
            endAngle: -45,
            axisLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: [[1, 'rgba(0,0,0,0)']],
              },
            }, // 仪表盘轴线
            axisTick: {
              // 坐标轴小标记
              splitNumber: 10, // 每份split细分多少段
              length: 6, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: this.echartOptions.splitColor,
                width: 1,
              },
            },
            axisLabel: {
              color: this.echartOptions.splitColor,
              fontSize: 12,
            }, // 刻度节点文字颜色
            // 刻度样式
            splitLine: {
              show: true,
              length: 12,
              lineStyle: {
                width: 1,
                color: this.echartOptions.splitColor,
              },
            },
            pointer: {
              show: 0,
            },
            detail: {
              show: 0,
            },
          },
        ],
      };

      this.option = this.$deepMerge(option, this.echartOptions);
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
.board-container {
  // width: 100%;
  height: 100%;
}
</style>
