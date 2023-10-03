<template>
  <div id="indexPage">
    <div class="indexPage-top-main">
      <div class="indexPage-top-col" v-for="item in getTopCountList" :key="item.id">
        <div class="flexRow info-box" :style="{ ...item.style }">
          <div class="info-box-icon flexCenter" :style="{ ...item.boxStyle }">
            <img :src="item.img" />
          </div>
          <div class="flexColumn info-box-content">
            <span class="info-box-text">{{ item.name }}</span>
            <span class="info-box-number" id="hireFrameworkCount">{{ getTopCountData[item.id] }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="achieve-goals-main">
      <el-card class="box-card">
        <div slot="header" class="flexRow cardHeader">
          <div>完成目标(单位:万)</div>
          <div class="achieve-goals-time">
            <el-select v-model="year" @change="changeYear" placeholder="请选择年份">
              <el-option v-for="item in years" :key="item" :label="item + '年'" :value="item"> </el-option>
            </el-select>
          </div>
        </div>
        <div class="flexRow achieve-goals-item">
          <div class="flexColumn achieve-item" v-for="item in achieveGoalsList" :key="item.id">
            <div class="header">{{ item.deptName }}</div>
            <div class="flexRow main">
              <div class="flexColumn leftMain">
                <div class="flexRow leftItem" v-for="rowItem in item.items" :key="rowItem.id">
                  <div class="flexCenter icon"><span :class="`iconfont ${rowItem.icon}`" /></div>
                  <span class="itemName">{{ rowItem.name }}</span>
                  <span class="itemNumber">{{ rowItem.value }}</span>
                </div>
              </div>
              <BoardStyle2 :sid="item.echartId" :source="item.source" :ref="item.echartId" />
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <div class="financial-operation-main">
      <el-card class="box-card">
        <div slot="header" class="flexRow cardHeader">
          <div>财务经营状况</div>
          <div class="financial-operation-time">
            <el-select v-model="month" @change="monthChange" placeholder="请选择月份">
              <el-option v-for="item in monthData" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="financial-operation-item">
          <LineStyle3
            :chartId="'financialLine'"
            ref="financialLine"
            :chartData="financialLineData"
            :options="financialLineOptions"
          />
          <!-- <div class="pie-mian" id="myChart1"></div> -->
        </div>
      </el-card>
    </div>

    <div class="flexRow tendencyContainer">
      <div>
        <el-card class="box-card">
          <div slot="header" class="flexRow cardHeader">
            <div>生产中心经营状况</div>
            <div class="tendency-operation-time">
              <el-select v-model="productionCenterMonth" @change="productionCenterMonthChange" placeholder="请选择月份">
                <el-option v-for="item in monthData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="tendency-item">
            <LineStyle3
              :chartId="'tendencyLine'"
              ref="tendencyLine"
              :chartData="tendencyData"
              :options="tendencyOptions"
            />
          </div>
        </el-card>
      </div>
    </div>

    <div class="flexRow bottomContainer">
      <div class="production-center-operation">
        <el-card class="box-card">
          <div slot="header">
            <div>生产中心经营总额(单位/万)</div>
          </div>
          <div class="tendency-item">
            <div class="pie-mian" id="myChart2"></div>
          </div>
        </el-card>
      </div>

      <div class="achieve-goals">
        <el-card class="box-card">
          <div slot="header">
            <div>完成目标</div>
          </div>
          <div class="tendency-item">
            <div class="pie-mian">
              <img :src="index4" class="bg" />
              <vue-seamless-scroll
                class="achieveGoalsBox"
                :data="achieveGoalsData"
                :class-option="defaultOption"
                ref="achieveGoalsBox"
              >
                <el-timeline :reverse="true">
                  <el-timeline-item
                    v-for="(item, index) in achieveGoalsData"
                    :key="index"
                    :timestamp="item.timelineLabel"
                    placement="top"
                  >
                    <ul class="timelineItem">
                      <li v-for="(val, idx) in item.value" :key="idx + '--'">
                        <span class="deptName">{{ val.deptName }}</span>
                        <span class="showAmount">已完成: {{ val.showAmount }}</span>
                      </li>
                    </ul>
                  </el-timeline-item>
                </el-timeline>
              </vue-seamless-scroll>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <div class="flexRow lastContainer">
      <div class="professional-operation">
        <el-card class="box-card">
          <div slot="header" class="flexRow cardHeader">
            <div>专业经营状况</div>
            <div class="tendency-operation-time">
              <el-select v-model="tendencyChangeMonth" @change="tendencyChange" placeholder="请选择月份">
                <el-option v-for="item in monthData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="professional-operation-item">
            <LineStyle3 :chartId="'lastLine'" ref="lastLine" :chartData="lastData" :options="lastOptions" />
            <div class="professional-operation-mian" id="myChart4"></div>
          </div>
        </el-card>
      </div>

      <div class="partner">
        <el-card class="box-card">
          <div slot="header">
            <div>合作单位资质情况汇总</div>
          </div>
          <div class="partner-item">
            <div class="partner-mian" id="myChart3"></div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import BoardStyle2 from '@/components/BoardStyle2.vue';
import LineStyle3, { getAreaColor, getLinearColor } from '@/components/LineStyle3.vue';
import {
  getTopCount,
  getDeptYearAmountInfoByYear,
  getReportByMonths,
  getReportData,
  getDeptYearAmountInfoByAll,
  getUnitCountInfo,
} from 'api/indexPage/index';
import { transformMoney, getYear } from '@/util/tool';
import vueSeamlessScroll from 'vue-seamless-scroll';
import index11 from '@/common/images/indexPage/index11.png';
import index12 from '@/common/images/indexPage/index12.png';
import index13 from '@/common/images/indexPage/index13.png';
import index14 from '@/common/images/indexPage/index14.png';
import index4 from '@/common/images/indexPage/img4.png';
const animationDuration = 2000;

export default {
  name: 'indexPage',
  data() {
    return {
      getTopCountList: [
        {
          id: 'hireFrameworkCount',
          name: '承揽框架',
          img: index11,
          style: {
            background: 'linear-gradient(147deg,#ffac99 0%, #eb5c82 100%)',
          },
        },
        {
          id: 'cooperationFrameworkCount',
          name: '合作框架',
          img: index12,
          style: {
            background: 'linear-gradient(147deg,#99a3ff 0%, #5c8eeb 100%)',
          },
          boxStyle: {
            boxShadow: '0px 3px 10px 0px rgba(199,199,199,0.51), 0px 3px 10px 0px rgba(96,115,217,0.60)',
          },
        },
        {
          id: 'bankRecordAmount',
          name: '收款金额(单位:万)',
          img: index13,
          style: {
            background: 'linear-gradient(147deg,#2ac4ff 13%, #3dacff 100%)',
          },
          boxStyle: {
            boxShadow: '0px 3px 10px 0px rgba(199,199,199,0.51), 0px 3px 10px 0px rgba(64,146,209,0.60)',
          },
        },
        {
          id: 'contractAmount',
          name: '合作金额(单位:万)',
          img: index14,
          style: {
            background: 'linear-gradient(147deg,#95d88b 0%, #4bd19b 100%)',
          },
          boxStyle: {
            boxShadow: '0px 3px 10px 0px rgba(199,199,199,0.51), 0px 3px 10px 0px rgba(50,197,137,0.60)',
          },
        },
      ],
      achieveGoalsList: [],
      achieveGoals: [
        {
          echartId: 'myChart6',
          items: [
            {
              id: 'targetAmount',
              name: '目标',
              icon: 'icon-hongqi',
            },
            {
              id: 'showAmount',
              name: '完成',
              icon: 'icon-xingxing',
            },
          ],
        },
      ],
      boardEchart: [],
      financialLineData: {},
      financialLineOptions: {
        legend: {},
        xAxis: {
          axisLine: {
            lineStyle: {
              color: 'rgba(171,171,171,0.72)', // 坐标轴的颜色
              type: 'dotted',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#88929E',
              fontSize: 14,
              fontFamily: 'PingFangSC',
            },
          },
        },
        yAxis: [
          {
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(171,171,171,0.31)',
                type: 'dotted',
              },
            },
            axisLabel: {
              textStyle: {
                color: '#88929E',
                fontSize: 14,
                fontFamily: 'PingFangSC',
              },
            },
          },
        ],
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: {
              show: true,
              readOnly: false,
            },
            magicType: {
              show: true,
              type: ['line', 'bar', 'stack', 'tiled'],
            },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [],
      },
      tendencyData: {},
      tendencyOptions: {
        legend: {},
        xAxis: {
          axisLine: {
            lineStyle: {
              color: 'rgba(171,171,171,0.72)', // 坐标轴的颜色
              type: 'dotted',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#88929E',
              fontSize: 14,
              fontFamily: 'PingFangSC',
            },
          },
        },
        yAxis: [
          {
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(171,171,171,0.31)',
                type: 'dotted',
              },
            },
            axisLabel: {
              textStyle: {
                color: '#88929E',
                fontSize: 14,
                fontFamily: 'PingFangSC',
              },
            },
          },
        ],
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: {
              show: true,
              readOnly: false,
            },
            magicType: {
              show: true,
              type: ['line', 'bar', 'stack', 'tiled'],
            },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [],
      },
      lastData: {},
      lastOptions: {
        legend: {},
        xAxis: {
          axisLine: {
            lineStyle: {
              color: 'rgba(171,171,171,0.72)', // 坐标轴的颜色
              type: 'dotted',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#88929E',
              fontSize: 14,
              fontFamily: 'PingFangSC',
            },
          },
        },
        yAxis: [
          {
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(171,171,171,0.31)',
                type: 'dotted',
              },
            },
            axisLabel: {
              textStyle: {
                color: '#88929E',
                fontSize: 14,
                fontFamily: 'PingFangSC',
              },
            },
          },
        ],
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: {
              show: true,
              readOnly: false,
            },
            magicType: {
              show: true,
              type: ['line', 'bar', 'stack', 'tiled'],
            },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [],
      },
      getTopCountData: {},
      year: null,
      years: [],
      myChart1: null,
      myChart2: null,
      myChart3: null,
      myChar4: null,
      myChart5: null,
      myChart6: null,
      myChart7: null,
      myChart8: null,
      myChart9: null,
      monthData: [
        {
          label: '3月',
          value: 3,
        },
        {
          label: '6月',
          value: 6,
        },
        {
          label: '9月',
          value: 9,
        },
        {
          label: '12月',
          value: 12,
        },
      ],
      month: '',
      tendencyChangeMonth: '',
      productionCenterMonth: '',
      achieveGoalsData: [],
      index4,
    };
  },
  computed: {
    defaultOption() {
      return {
        step: 0.4, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  components: {
    vueSeamlessScroll,
    BoardStyle2,
    LineStyle3,
  },
  mounted() {
    this.$nextTick(async () => {
      this.years = await getYear(10);
      this.year = this.years[0];
      this.month = this.monthData[0].value;
      this.tendencyChangeMonth = this.monthData[0].value;
      this.productionCenterMonth = this.monthData[0].value;
      this.getTopCount(); // 头部的统计 -- 获取数据
      this.getDeptYearAmountInfoByYear(this.year); // 完成目标(单位:万) 接口调用
      this.getFinancialOperation(this.month); // 财务经营状况 接口调用

      this.getTendency(this.productionCenterMonth); // 专业经营状况 接口调用
      this.getProductionCenter(this.productionCenterMonth); // 生产中心经营状况 接口调用
      this.getDeptYearAmountInfoByAll(); // 生产中心经营总额(单位:万) 接口调用
      this.getUnitCountInfo(); // 合作单位资质情况汇总 接口调用
    });
  },
  methods: {
    ...mapMutations(['set_common']),
    // 头部的统计 -- 获取数据
    getTopCount() {
      getTopCount().then((res) => {
        if (res.code === '200') {
          this.getTopCountData = res.data;
        }
      });
    },
    // 完成目标(单位:万) 下拉切换事件
    changeYear() {
      this.getDeptYearAmountInfoByYear(this.year);
    },
    clearEchart() {
      if (this.boardEchart.length > 0) {
        this.boardEchart.forEach((echartItem) => {
          this.$refs[echartItem][0].handleDispose();
        });
      }
      this.boardEchart = [];
    },
    reInitEchart() {
      if (this.boardEchart.length > 0) {
        this.boardEchart.forEach((echartItem) => {
          if (this.$refs[echartItem]) {
            this.$refs[echartItem][0].init();
          }
        });
      }
    },
    // 完成目标(单位:万)
    getDeptYearAmountInfoByYear(year) {
      getDeptYearAmountInfoByYear(year).then(async (res) => {
        if (res.code === '200') {
          await this.clearEchart();
          const deptYearDataList = res.data;

          this.achieveGoalsList = [];
          for (let i = 0; i < deptYearDataList.length; i++) {
            deptYearDataList[i].showAmountPric = deptYearDataList[i].showAmount.replace(',', '');
            deptYearDataList[i].targetAmountPric = deptYearDataList[i].targetAmount.replace(',', '');
            let achieveGoalItem = this.achieveGoals[i];

            const achieveGoalItemsList = this.achieveGoals[0].items.map((item) => ({
              ...item,
              value: deptYearDataList[i][item.id],
            }));

            let source =
              Math.round(
                (parseFloat(deptYearDataList[i].showAmountPric) / parseFloat(deptYearDataList[i].targetAmountPric)) *
                  10000,
              ) / 100;

            if (parseFloat(deptYearDataList[i].targetAmountPric) === 0) {
              source = 0;
            }
            const echartId = `board${i}`;

            achieveGoalItem = {
              ...achieveGoalItem,
              echartId,
              source: `${source}`,
              deptName: deptYearDataList[i].deptName,
              items: achieveGoalItemsList,
            };
            this.boardEchart.push(echartId);
            this.achieveGoalsList[i] = achieveGoalItem;
          }
          this.reInitEchart();
        }
      });
    },
    // 财务经营状况 月份切换
    monthChange(month) {
      this.getFinancialOperation(month);
    },
    // 专业经营状况 月份切换
    tendencyChange(month) {
      this.getTendency(month);
    },
    // 生产中心经营状况 月份切换
    productionCenterMonthChange(month) {
      this.getProductionCenter(month);
    },

    // 财务经营状况 的接口请求
    getFinancialOperation(monthVal) {
      getReportByMonths(monthVal).then((res) => {
        if (res.code === '200') {
          this.financialOperation(res.data);
        }
      });
    },

    // 财务经营状况
    financialOperation(dataList) {
      const legendData = [];
      const seriesData = [];
      const xAxisData = [];
      const yAxisData = [];
      const oldData = {}; // 未拼装数据

      for (let j = 0; j < dataList.length; j++) {
        // { "amount": 0,"t": "收款金额","mounth": "2018-12" }
        if (oldData[dataList[j].mounth]) {
          const title = dataList[j].t,
            m = dataList[j].mounth,
            am = parseFloat(dataList[j].amount);

          yAxisData.push(dataList[j].amount);
          if (oldData[m][title]) {
            oldData[m][title]._data += am;
          } else {
            // 2019-03 : {暂付金额: {}, ?}
            oldData[m][title] = {
              name: title,
              type: 'line',
              smooth: true,
              itemStyle: { normal: { areaStyle: { type: 'default' } } },
              data: [],
              _data: am,
            };
          }
        } else {
          oldData[dataList[j].mounth] = {}; //  2019-03: {}
          const title = dataList[j].t, // 标题
            m = dataList[j].mounth, // 月份
            am = parseFloat(dataList[j].amount);

          yAxisData.push(dataList[j].amount);
          oldData[m][title] = {
            name: title,
            type: 'line',
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: [],
            _data: am,
          };
        }
      }

      const tempKey = {};

      for (const old in oldData) {
        if (oldData.hasOwnProperty(old)) {
          xAxisData.push(old); // x 日期
          for (const z in oldData[old]) {
            // 暂付金额: {}
            if (tempKey[z]) {
              tempKey[z].data.push(oldData[old][z]._data.toFixed(2));
            } else {
              tempKey[z] = oldData[old][z];
              tempKey[z].data.push(oldData[old][z]._data.toFixed(2));
            }
          }
        }
      }

      tempKey['暂估未付'] = {
        name: '暂估未付',
        type: 'line',
        smooth: true,
        itemStyle: { normal: { areaStyle: { type: 'default' } } },
        data: [],
      };

      let iStr = 0;

      while (iStr < (tempKey['暂付金额'] && tempKey['暂付金额'].data.length)) {
        tempKey['暂估未付'].data[iStr] = (
          parseFloat(tempKey['暂付金额'].data[iStr]) - parseFloat(tempKey['付款金额'].data[iStr])
        ).toFixed(2);
        iStr++;
      }

      delete tempKey['暂付金额'];
      const color = [
        {
          itemNormalColor: 'rgba(25,204,195,1)',

          areaStyleColor: getAreaColor('rgba(25,204,195,0.26)', 'rgba(25,204,195,0)'),
          itemStyleColor: getLinearColor('rgba(25,204,195,0.08)', 'rgba(25,204,195,1)', 'rgba(25,204,195,0.08)'),
        },
        {
          itemNormalColor: 'rgba(2,129,255,1)',

          areaStyleColor: getAreaColor('rgba(2,129,255,0.26)', 'rgba(2,129,255,0)'),
          itemStyleColor: getLinearColor('rgba(2,129,255,0.08)', 'rgba(2,129,255,1)', 'rgba(2,129,255,0.08)'),
        },
        {
          itemNormalColor: 'rgba(180,108,211,1)',

          areaStyleColor: getAreaColor('rgba(180,108,211,0.26)', 'rgba(180,108,211,0)'),
          itemStyleColor: getLinearColor('rgba(180,108,211,0.08)', 'rgba(180,108,211,1)', 'rgba(180,108,211,0.08)'),
        },
        {
          itemNormalColor: 'rgba(195,178,34,1)',

          areaStyleColor: getAreaColor('rgba(195,178,34,0.26)', 'rgba(195,178,34,0)'),
          itemStyleColor: getLinearColor('rgba(195,178,34,0.08)', 'rgba(195,178,34,1)', 'rgba(195,178,34,0.08)'),
        },
        {
          itemNormalColor: 'rgba(103,222,55,1)',

          areaStyleColor: getAreaColor('rgba(103,222,55,0.26)', 'rgba(103,222,55,0)'),
          itemStyleColor: getLinearColor('rgba(103,222,55,0.08)', 'rgba(103,222,55,1)', 'rgba(103,222,55,0.08)'),
        },
        {
          itemNormalColor: 'rgba(255,172,80,1)',
          areaStyleColor: getAreaColor('rgba(255,172,80,0.26)', 'rgba(255,172,80,0)'),
          itemStyleColor: getLinearColor('rgba(255,172,80,0.08)', 'rgba(255,172,80,1)', 'rgba(255,172,80,0.08)'),
        },
      ];

      Object.keys(tempKey).forEach((tempKeyItem, tempKeyIndex) => {
        legendData.push({
          name: tempKeyItem,
          icon: 'circle',
          textStyle: {
            fontSize: 14,
            fontFamily: 'PingFangSC',
            fontWeight: 400,
            color: '#636363',
          },
        });
        seriesData.push({
          ...tempKey[tempKeyItem],
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          symbol: 'none',
          areaStyle: {
            normal: {
              color: color[tempKeyIndex].areaStyleColor, // 改变区域颜色
            },
          },
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2,
                color: color[tempKeyIndex].itemStyleColor, // 改变折线颜色
              },
            },
          },
        });
      });
      this.financialLineOptions = {
        ...this.financialLineOptions,
        color: color.map((colorItem) => colorItem.itemNormalColor),
        title: {
          text: '单位/万',
          textStyle: {
            color: '#636363',
            fontSize: 14,
          },
        },
        yAxis: [
          {
            ...this.financialLineOptions.yAxis[0],
            max: Math.ceil(Math.max.apply('', yAxisData)),
            splitNumber: 5,
            min: 0,
            scale: true,
          },
        ],
        xAxis: {
          ...this.financialLineOptions.xAxis,
          data: xAxisData,
        },
        legend: {
          data: legendData,
        },
        series: seriesData,
      };
    },

    // 专业经营状况 的接口请求
    getTendency(monthVal) {
      const params = {
        month: monthVal,
        type: 'major',
      };

      getReportData(params).then((res) => {
        if (res.code === '200') {
          this.tendencyChart(res.data);
        }
      });
    },

    // 专业经营状况
    tendencyChart(dataList) {
      // this.myChart4 = this.$echarts.init(document.getElementById('myChart4'));
      const lineColorList = ['#19CCC3', '#2A81FF', '#B46CD3', '#C3B222', '#FFAC50', '#67DE37'];
      const legendData = [];
      const seriesData = [];
      const xAxisData = [];
      const oldData = {}; // 未拼装数据
      const tempKey = {};

      Object.keys(dataList).forEach((dataKey, dataIndex) => {
        legendData.push({
          name: dataKey,
          icon: 'circle',
          textStyle: {
            fontSize: 14,
            fontFamily: 'PingFangSC',
            fontWeight: 400,
            color: '#636363',
          },
        });
        dataList[dataKey].forEach((dataKeyItem) => {
          if (dataKeyItem.t !== '合同金额') {
            return;
          }
          if (oldData[dataKeyItem.mounth]) {
            oldData[dataKeyItem.mounth] = {
              ...oldData[dataKeyItem.mounth],
              [dataKey]: {
                data: dataKeyItem.amount,
              },
            };
          } else {
            oldData[dataKeyItem.mounth] = {
              [dataKey]: {
                data: dataKeyItem.amount,
              },
            };
          }
        });
      });
      Object.keys(oldData).forEach((dataItem) => {
        xAxisData.push(dataItem);
        const oldDataObject = Object.keys(oldData[dataItem]);

        oldDataObject.forEach((sonDataItem) => {
          if (tempKey[sonDataItem] && tempKey[sonDataItem].data) {
            tempKey[sonDataItem].data.push(oldData[dataItem][sonDataItem].data);
          } else {
            tempKey[sonDataItem] = {
              data: [oldData[dataItem][sonDataItem].data],
            };
          }
        });
      });
      for (const f in tempKey) {
        if (tempKey.hasOwnProperty(f)) {
          seriesData.push({
            ...tempKey[f],
            name: f,
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            symbol: 'none',
          });
        }
      }
      this.lastOptions = {
        ...this.lastOptions,
        color: lineColorList,
        legend: {
          data: legendData,
        },
        yAxis: [
          {
            ...this.lastOptions.yAxis[0],
            splitNumber: 5,
            min: 0,
            scale: true,
          },
        ],
        xAxis: {
          ...this.lastOptions.xAxis,
          data: xAxisData,
        },
        series: seriesData,
      };
    },

    // 生产中心经营状况 的接口请求
    getProductionCenter(monthVal) {
      const params = {
        month: monthVal,
        type: 'dept',
      };

      getReportData(params).then((res) => {
        if (res.code === '200') {
          this.productionCenterChart(res.data);
        }
      });
    },

    // 生产中心经营状况
    productionCenterChart(dataList) {
      // this.myChart5 = this.$echarts.init(document.getElementById('myChart5'));
      const lineColorList = [
        '#8DC4D9',
        '#E29CAD',
        '#BD8750',
        '#FF895A',
        '#38C0FF',
        '#19CCC3',
        '#2A81FF',
        '#B46CD3',
        '#C3B222',
        '#67DE37',
        '#FFAC50',
        '#8CC164',
      ];
      const legendData = [];
      const seriesData = [];
      const xAxisData = [];
      const oldData = {}; // 未拼装数据
      const tempKey = {};

      Object.keys(dataList).forEach((dataKey) => {
        legendData.push({
          name: dataKey,
          icon: 'circle',
          textStyle: {
            fontSize: 14,
            fontFamily: 'PingFangSC',
            fontWeight: 400,
            color: '#636363',
          },
        });
        dataList[dataKey].forEach((dataKeyItem) => {
          if (dataKeyItem.t !== '合同金额') {
            return;
          }
          if (oldData[dataKeyItem.mounth]) {
            oldData[dataKeyItem.mounth] = {
              ...oldData[dataKeyItem.mounth],
              [dataKey]: {
                data: dataKeyItem.amount,
              },
            };
          } else {
            oldData[dataKeyItem.mounth] = {
              [dataKey]: {
                data: dataKeyItem.amount,
              },
            };
          }
        });
      });
      Object.keys(oldData).forEach((dataItem) => {
        xAxisData.push(dataItem);
        const oldDataObject = Object.keys(oldData[dataItem]);

        oldDataObject.forEach((sonDataItem) => {
          if (tempKey[sonDataItem] && tempKey[sonDataItem].data) {
            tempKey[sonDataItem].data.push(oldData[dataItem][sonDataItem].data);
          } else {
            tempKey[sonDataItem] = {
              data: [oldData[dataItem][sonDataItem].data],
            };
          }
        });
      });
      for (const f in tempKey) {
        if (tempKey.hasOwnProperty(f)) {
          seriesData.push({
            ...tempKey[f],
            name: f,
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            symbol: 'none',
          });
        }
      }
      const barColorList = [
        '#8DC4D9',
        '#E29CAD',
        '#BD8750',
        '#FF895A',
        '#38C0FF',
        '#19CCC3',
        '#2A81FF',
        '#B46CD3',
        '#C3B222',
        '#67DE37',
        '#FFAC50',
        '#8CC164',
      ];

      this.tendencyOptions = {
        ...this.tendencyOptions,
        title: {
          text: '单位/万',
          textStyle: {
            color: '#636363',
            fontSize: 14,
          },
        },
        color: barColorList,
        legend: {
          data: legendData,
        },
        grid: {
          top: '30%',
        },
        yAxis: [
          {
            ...this.tendencyOptions.yAxis[0],
            splitNumber: 5,
            min: 0,
            scale: true,
          },
        ],
        xAxis: {
          ...this.tendencyOptions.xAxis,
          data: xAxisData,
        },
        series: seriesData,
      };
    },

    // 生产中心经营总额(单位:万) 接口调用
    getDeptYearAmountInfoByAll() {
      getDeptYearAmountInfoByAll().then((res) => {
        if (res.code === '200') {
          const deptYearAmountInfoByAllData = res.data;

          this.achieveGoalsData = []; // 定义数组
          for (const i in deptYearAmountInfoByAllData) {
            if (deptYearAmountInfoByAllData.hasOwnProperty(i)) {
              const obj = {
                timelineLabel: i,
                value: deptYearAmountInfoByAllData[i],
              };

              this.achieveGoalsData.push(obj);
            }
          }
          this.deptYearAmountInfoByAllChart(deptYearAmountInfoByAllData);
        }
      });
    },
    deptYearAmountInfoByAllChart(dataObj) {
      const echarts = this.$echarts;
      const barColorList = ['#F2895D', '#F8CD28', '#419CB9', '#3AD0BC', '#6997F4'];

      this.myChart2 = this.$echarts.init(document.getElementById('myChart2'));
      this.myChart2.hideLoading();

      const legendData = [];
      const seriesData = [];
      const xAxisData = [];
      const oldData = {};
      const labelOption = {
        normal: {
          // 如果要在柱子上显示名称以及值，show: true
          show: false,
          rotate: 90,
          align: 'left',
          verticalAlign: 'middle',
          position: 'insideBottom',
          distance: 15,
          formatter: '{name|{c}}  {name|{a}}',
          fontSize: 12,
          rich: {
            name: {
              color: '#333',
              textBorderColor: '#fff',
            },
          },
        },
      };

      let dataListIndex = 0;

      Object.keys(dataObj).forEach((dataKey) => {
        xAxisData.push(dataKey);
        dataObj[dataKey].index = dataListIndex++;
        const _index = dataObj[dataKey].index;

        dataObj[dataKey].forEach((item) => {
          item.showAmountPric = item.showAmount.replace(',', '');
          item.targetAmountPric = item.targetAmount.replace(',', '');
        });
        for (let j = 0; j < dataObj[dataKey].length; j++) {
          if (!oldData[dataObj[dataKey][j].deptID]) {
            oldData[dataObj[dataKey][j].deptID] = {}; //  010: {}
            legendData.push({
              name: dataObj[dataKey][j].deptName,
              icon: 'circle',
              textStyle: {
                fontSize: 14,
                fontFamily: 'PingFangSC',
                fontWeight: 400,
                color: '#636363',
              },
            });
            oldData[dataObj[dataKey][j].deptID] = {
              name: dataObj[dataKey][j].deptName,
              type: 'bar',
              yAxisIndex: 0,
              label: labelOption,
              data: [],
            };
          }
          oldData[dataObj[dataKey][j].deptID].data[_index] = dataObj[dataKey][j].showAmountPric;
        }
      });

      for (const a in oldData) {
        if (oldData.hasOwnProperty(a)) {
          seriesData.push(oldData[a]);
        }
      }
      const option = {
        color: barColorList,
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
        toolbox: {
          show: false,
        },
        legend: {
          itemWidth: 10,
          itemHeight: 4,
          left: 'right',
          top: '2',
          ...this.financialLineOptions.legend,
          data: legendData,
        },
        grid: {
          show: true,
          borderWidth: 0,
          borderColor: '#fff',
          left: '0%',
          right: '0%',
          bottom: '0%',
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
          data: xAxisData,
        },
        yAxis: [
          {
            type: 'value',
            name: '',
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
                color: 'rgba(171,171,171,0.31)',
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
              formatter(a) {
                const val = Number(a);

                return isFinite(val) ? echarts.format.addCommas(Number(val) / 1000) : '';
              },
            },
          },
        ],
        series: seriesData,
      };

      window.addEventListener('resize', () => {
        this.myChart2.resize();
      });
      this.myChart2.setOption(option);
    },

    // 合作单位资质情况汇总 接口调用
    getUnitCountInfo() {
      getUnitCountInfo().then((res) => {
        if (res.code === '200') {
          this.unitCountInfoChart(res.data);
        }
      });
    },
    // 合作单位资质情况汇总
    unitCountInfoChart(dataList) {
      this.myChart3 = this.$echarts.init(document.getElementById('myChart3'));
      const pieColorList = ['#2A81FF', '#19CCC3', '#F2895D', '#F8CD28', '#6997F4'];
      const legendData = [];
      const seriesData = [];
      const selected = {};

      for (let i = 0; i < dataList.length; i++) {
        const { name } = dataList[i];

        legendData.push(name);
        seriesData.push({
          name,
          value: dataList[i].count, // 占比
        });
        selected[name] = i < 15;
      }
      const option = {
        color: pieColorList,
        // title: {
        //   text: '',
        //   subtext: '',
        //   x: '160px',
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          type: 'scroll',
          orient: 'horizontal',
          // right: 0,
          bottom: 0,
          data: legendData,
          selected,
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '65%',
            center: ['50%', '40%'],
            data: seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };

      if (option && typeof option === 'object') {
        this.myChart3.setOption(option);
      }
    },
  },
};
</script>

<style lang="less" scoped>
#indexPage {
  background-color: #fff;
  overflow-x: auto;
  .indexPage-top-main {
    height: 90px;
    display: flex;
    margin: 0 -7.5px 15px;
    .indexPage-top-col {
      padding: 7.5px;
      width: 25%;
      box-sizing: border-box;
      .info-box {
        overflow: hidden;
        width: 100%;
        height: 84px;
        background: linear-gradient(147deg, #ffac99 0%, #eb5c82 100%);
        border-radius: 6px;
        box-shadow: 0px 3px 10px 0px rgba(199, 199, 199, 0.51);
        padding: 18px;
        box-sizing: border-box;
        .info-box-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 4px;
          box-shadow: 0px 3px 10px 0px rgba(199, 199, 199, 0.51), 0px 3px 10px 0px rgba(215, 91, 125, 0.6);
          margin-right: 14px;
          image {
            width: 44px;
            height: auto;
          }
        }
        .info-box-content {
          justify-content: space-between;
          .info-box-text {
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: left;
            color: #ffffff;
            line-height: 20px;
            text-shadow: 0px 3px 10px 0px rgba(199, 199, 199, 0.51);
          }
          .info-box-number {
            font-size: 24px;
            font-family: DINAlternate, DINAlternate-Bold;
            font-weight: 700;
            text-align: left;
            color: #ffffff;
            line-height: 28px;
            text-shadow: 0px 3px 10px 0px rgba(199, 199, 199, 0.51);
          }
        }
      }
    }
  }
  /deep/.box-card {
    overflow: inherit;
    .el-card__header {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #141414;
      line-height: 14px;
      .cardHeader {
        justify-content: space-between;
        align-items: center;
      }
    }
    .el-card__body {
      padding: 20px;
    }
  }
  .achieve-goals-main {
    // height: 290px;
    font-size: 18px;
    line-height: 1;
    position: relative;
    .achieve-goals-item {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      justify-content: space-between;
      .achieve-item {
        // padding: 20px;
        padding-bottom: 15px;
        width: calc(25% - 10px);
        position: relative;
        box-sizing: border-box;
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 0;
          width: 1px;
          height: calc(100% - 40px);
          background: #ececec;
        }
        .header {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
          text-align: left;
          color: #141414;
          line-height: 14px;
        }
        .main {
          .leftMain {
            width: 40%;
            // flex: auto;
            justify-content: center;
            .leftItem {
              margin-bottom: 15px;
              align-items: center;
              .icon {
                width: 24px;
                height: 24px;
                background: #ffedea;
                border-radius: 50%;

                .iconfont {
                  color: #ef2d32;
                  font-size: 12px;
                }
              }
              .itemName {
                font-size: 12px;
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #141414;
                margin-left: 6px;
                margin-right: 10px;
              }
              .itemNumber {
                font-size: 12px;
                font-family: DINAlternate, DINAlternate-Bold;
                font-weight: 700;
                text-align: left;
                color: #ef2d32;
              }
              &:last-child {
                margin-bottom: 0;
                .icon {
                  background: #e7f1ff;
                  .iconfont {
                    color: #518de0;
                  }
                }
                .itemNumber {
                  color: #518de0;
                }
              }
            }
          }
          .board-container {
            height: 145px;
            width: 60%;
          }
        }
        &:nth-of-type(4n) {
          &::after {
            content: none;
          }
        }
      }
    }
    .achieve-goals-time {
      // position: absolute;
      // right: 10px;
      // top: 60px;
      float: right;
      width: 90px;
    }
  }
  .financial-operation-main {
    // height: 290px;
    font-size: 18px;
    line-height: 1;
    position: relative;
    margin-top: 20px;
    z-index: 10;
    .financial-operation-item {
      display: flex;
      /deep/#financialLine {
        height: 200px;
        flex: auto;
      }
    }
    .financial-operation-time {
      float: right;
      width: 90px;
    }
  }

  .tendencyContainer {
    margin-top: 20px;
    width: 100%;
    justify-content: space-between;
    > div {
      display: inline-block;
      width: 100%;
      // height: 420px;
      box-sizing: border-box;
      // overflow: hidden;
      position: relative;
      z-index: 20;
      .tendency-item {
        display: flex;
        /deep/#tendencyLine {
          height: 200px;
          flex: auto;
        }
      }
      .tendency-operation-time {
        float: right;
        width: 90px;
      }
    }
  }

  .bottomContainer {
    margin-top: 20px;
    width: 100%;
    justify-content: space-between;
    .production-center-operation {
      display: inline-block;
      // height: 420px;
      box-sizing: border-box;
      overflow: hidden;
      // margin-right: 10px;
      width: calc(70% - 20px);
      .tendency-item {
        display: flex;
        .pie-mian {
          height: 200px;
          flex: auto;
          width: 100%;
        }
      }
    }
    .achieve-goals {
      display: inline-block;
      // height: 420px;
      box-sizing: border-box;
      overflow: hidden;
      // margin-right: 10px;
      width: 30%;
      .tendency-item {
        display: flex;
        .pie-mian {
          height: 200px;
          flex: auto;
          width: 100%;
          position: relative;
          .bg {
            position: absolute;
            width: 124px;
            right: 0;
            top: 0;
          }
          .achieveGoalsBox {
            width: 100%;
            height: 100%;
            overflow: hidden;
            /deep/.el-timeline {
              .el-timeline-item {
                .el-timeline-item__tail {
                  left: 13px;
                  border-left: 1px solid #e5e5e5;
                }
                .el-timeline-item__node {
                  left: 1px;
                  width: 26px;
                  height: 26px;
                  background: url('~common/images/indexPage/index41.png') no-repeat center;
                  background-size: 100% 100%;
                }
                .el-timeline-item__wrapper {
                  padding-left: calc(26px + 15px);
                  .el-timeline-item__timestamp {
                    margin-bottom: 15px;
                    font-size: 18px;
                    font-family: PingFangSC, PingFangSC-Medium;
                    font-weight: 500;
                    text-align: left;
                    color: #141414;
                    line-height: 20px;
                  }
                  .timelineItem {
                    li {
                      margin-bottom: 15px;
                      .deptName {
                        padding: 3px 10px;
                        font-size: 14px;
                        font-family: PingFangSC, PingFangSC-Regular;
                        font-weight: 400;
                        text-align: left;
                        color: #141414;
                        background: #fff3e5;
                        border-radius: 4px;
                        box-shadow: 0px 2px 4px 0px rgba(223, 179, 159, 0.56);
                        margin-right: 8px;
                      }
                      .showAmount {
                        font-size: 14px;
                        font-family: PingFangSC, PingFangSC-Regular;
                        font-weight: 400;
                        text-align: left;
                        color: #141414;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .lastContainer {
    margin-top: 20px;
    width: 100%;
    justify-content: space-between;
    .professional-operation {
      display: inline-block;
      // height: 420px;
      box-sizing: border-box;
      // overflow: hidden;
      // margin-right: 10px;
      width: calc(70% - 20px);
      position: relative;
      .professional-operation-item {
        display: flex;
        /deep/#lastLine {
          height: 200px;
          flex: auto;
          width: 100%;
        }
      }
      .tendency-operation-time {
        float: right;
        width: 90px;
      }
    }
    .partner {
      display: inline-block;
      // height: 420px;
      box-sizing: border-box;
      overflow: hidden;
      // margin-right: 10px;
      width: 30%;
      .el-card {
        height: 100%;
        box-sizing: border-box;
      }
      .partner-item {
        display: flex;
        .partner-mian {
          height: 200px;
          flex: auto;
          width: 100%;
        }
      }
    }
  }
}
</style>
