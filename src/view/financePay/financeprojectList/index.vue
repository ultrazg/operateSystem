<template>
  <div class="financeLedger">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        :showNum="12"
        @onSearch="onSearch"
        @onReset="onReset"
      />
    </header-title>
    <!-- 页面 -->
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          ref="pageTable"
          col-align="left"
          operator-width="110"
          :loading="loading"
          :data="tableData"
          :cols="tableCols"
          :hideDefaultIndex="true"
          :selection="false"
          :operator="true"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          :operatorWidth="70"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="查看"
                icon="iconfont icon-yulan"
                v-if="$_hasOperation(routerCode, 'detail')"
                @click.prevent.stop="
                  openDialog('baseInfo', {
                    row: scope.row,
                    type: 'baseInfo',
                    configType: 'baseInfo',
                  })
                "
              >
                查看
              </el-button>
            </flex>
          </template>
        </page-table>
        <div v-show="false" class="nonedata">
          <div>
            <img src="~common/images/emptyData.png" alt="" />
            <p>暂无数据，晚点再来吧</p>
          </div>
        </div>
      </div>
    </div>
    <edit
      :show="editshow"
      :data="editdata"
      :title="editTitle"
      :width="editWidth"
      @cancel="closeEdit"
      @success="handleSuccess"
    />
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import { getListByCommand } from '@/api/financePay/financeprojectList';
export default {
  name: 'financeprojectList',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        name: undefined,
        erpNumber: undefined,
        consignor: undefined,
        oneMajor: undefined,
        twoMajor: undefined,
        status: undefined,
        province: undefined,
        city: undefined,
      },
      searchItems: [
        {
          type: 'input',
          label: '项目名称',
          initValue: undefined,
          props: {
            fieldName: 'name',
            filterable: true,
          },
        },
        {
          type: 'input',
          label: 'ERP编号',
          initValue: undefined,
          props: {
            fieldName: 'erpNumber',
            filterable: true,
          },
        },
        {
          type: 'select',
          label: '委托方',
          initValue: undefined,
          props: {
            fieldName: 'consignor',
            filterable: true,
            options: this.common().constructionCode,
          },
        },
        {
          type: 'select',
          label: '一级专业',
          initValue: undefined,
          props: {
            fieldName: 'oneMajor',
            filterable: true,
            options: this.common().majorCode,
          },
          events: {
            change: (val) => {
              console.log(val);
              this.searchVal.twoMajor = '';
              this.$set(this.searchItems[3], 'initValue', val);
              this.$getCode(val).then((data) => {
                this.$set(this.searchItems[4].props, 'options', data);
              });
            },
          },
        },
        {
          type: 'select',
          label: '二级专业',
          initValue: undefined,
          props: {
            fieldName: 'twoMajor',
            filterable: true,
            options: [],
          },
          events: {
            change: (val) => {
              this.$set(this.searchItems[4], 'initValue', val);
            },
          },
        },
        {
          type: 'select',
          label: '审核状态',
          initValue: undefined,
          props: {
            fieldName: 'status',
            filterable: true,
            options: this.common().verifyStatusCode,
          },
        },
        {
          type: 'select',
          label: '省份',
          initValue: undefined,
          props: {
            fieldName: 'province',
            options: this.common().provincialCode,
          },
          events: {
            change: (val) => {
              console.log(val);
              this.searchVal.city = '';
              this.$set(this.searchItems[6], 'initValue', val);
              this.$getCode(val).then((data) => {
                this.$set(this.searchItems[7].props, 'options', data);
              });
            },
          },
        },
        {
          type: 'select',
          label: '城市',
          initValue: undefined,
          props: {
            fieldName: 'city',
            filterable: true,
            options: [],
          },
          events: {
            change: (val) => {
              this.$set(this.searchItems[7], 'initValue', val);
            },
          },
        },
        {
          type: 'select',
          label: '主体',
          initValue: undefined,
          props: {
            fieldName: 'subject',
            filterable: true,
            options: this.common().subjectCode,
          },
        },
        {
          type: 'dataPicker',
          label: '创建时间起',
          labelWidth: '90px',
          initValue: undefined,
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'beginDate',
            placeholder: '请选择创建时间起',
          },
        },
        {
          type: 'dataPicker',
          label: '创建时间止',
          labelWidth: '90px',
          initValue: undefined,
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'endDate',
            placeholder: '请选择创建时间止',
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      tableCols: [
        {
          label: '项目名称',
          prop: 'name',
          align: 'center',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          align: 'center',
          render: (h, scope) =>
            h(
              'span',
              {
                class: {
                  canClick: true,
                },
                on: {
                  click: () => {
                    this.openDialog('projectDetailShow', {
                      row: scope.row,
                      type: 'projectDetailShow',
                      configType: 'projectDetailShow',
                    });
                  },
                },
              },
              scope.row.erpNumber,
            ),
        },
        {
          label: '总包合同金额',
          prop: 'hireContractAmount',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.statisticsAmountDto.hireContractAmount),
        },
        {
          label: '合作合同金额',
          prop: 'cooperationContractAmount',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.statisticsAmountDto.cooperationContractAmount),
        },
        {
          label: '总包审定金额',
          prop: 'verdictAmount',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.statisticsAmountDto.verdictAmount),
        },
        {
          label: '已开票金额',
          prop: 'invoiceAmount',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.statisticsAmountDto.invoiceAmount),
        },
        {
          label: '已回款金额',
          prop: 'receiveAmount',
          align: 'center',
          render: (h, scope) =>
            h(
              'span',
              {
                class: {
                  canClick: true,
                },
                on: {
                  click: () => {
                    this.openDialog('collectionDetail', {
                      row: scope.row,
                      type: 'collectionDetail',
                      configType: 'collectionDetail',
                    });
                  },
                },
              },
              scope.row.statisticsAmountDto.receiveAmount,
            ),
        },
        {
          label: '暂估应付余额',
          prop: 'estimatePayAmount',
          align: 'center',
          render: (h, scope) =>
            h(
              'span',
              {
                class: {
                  canClick: true,
                },
                on: {
                  click: () => {
                    this.openDialog('invoicePayLogDetail', {
                      row: scope.row,
                      type: 'invoicePayLogDetail',
                      configType: 'invoicePayLogDetail',
                    });
                  },
                },
              },
              scope.row.statisticsAmountDto.estimatePayAmount,
            ),
        },
        {
          label: '已支付金额',
          prop: 'actualPaymentAmount',
          align: 'center',
          render: (h, scope) =>
            h(
              'span',
              {
                class: {
                  canClick: true,
                },
                on: {
                  click: () => {
                    this.openDialog('paymentAmountDetail', {
                      row: scope.row,
                      type: 'paymentAmountDetail',
                      configType: 'paymentAmountDetail',
                    });
                  },
                },
              },
              scope.row.statisticsAmountDto.actualPaymentAmount,
            ),
        },
        {
          label: '已收分包发票金额',
          prop: 'subpackageAmount',
          align: 'center',
          render: (h, scope) =>
            h(
              'span',
              {
                class: {
                  canClick: true,
                },
                on: {
                  click: () => {
                    this.openDialog('cooperationInvoice', {
                      row: scope.row,
                      type: 'cooperationInvoice',
                      configType: 'cooperationInvoice',
                    });
                  },
                },
              },
              scope.row.statisticsAmountDto.subpackageAmount,
            ),
        },
        {
          label: '分包已列账金额',
          prop: 'businessAmount',
          align: 'center',
          render: (h, scope) =>
            h(
              'span',
              {
                class: {
                  canClick: true,
                },
                on: {
                  click: () => {
                    this.openDialog('financialAccount', {
                      row: scope.row,
                      type: 'financialAccount',
                      configType: 'base',
                    });
                  },
                },
              },
              scope.row.statisticsAmountDto.businessAmount,
            ),
        },
        {
          label: '省份',
          prop: 'province',
          align: 'center',
        },
        {
          label: '地市',
          prop: 'city',
          align: 'center',
        },
        {
          label: '一级专业',
          prop: 'oneMajor',
          align: 'center',
        },
        {
          label: '二级专业',
          prop: 'twoMajor',
          align: 'center',
        },
        {
          label: '项目经理',
          prop: 'manager',
          align: 'center',
        },
        {
          label: '委托方',
          prop: 'consignor',
          align: 'center',
        },
        {
          label: '主体',
          prop: 'subject',
          align: 'center',
        },
        {
          label: '建设方式',
          prop: 'constructionMode',
          align: 'center',
        },
        {
          label: '预估收入',
          prop: 'estimatedRevenue',
          align: 'center',
        },
        {
          label: '预估成本',
          prop: 'estimatedCost',
          align: 'center',
        },
        {
          label: '计划开工',
          prop: 'startTime',
          align: 'center',
        },
        {
          label: '计划完工',
          prop: 'endTime',
          align: 'center',
        },
        {
          label: '部门',
          prop: 'deptId',
          align: 'center',
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
        },
      ],
      editshow: false,
      editdata: {},
      editTitle: '',
      editWidth: '900px',
    };
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    Edit,
  },
  mounted() {
    this.$nextTick(() => {
      this.onSearch();
    });
  },
  methods: {
    // 重置
    onReset() {
      console.log('onReset');
    },
    // 搜索
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    // 请求某页数据
    onCurrentChange(val) {
      this.page.current = val;
      this.getDataAllList();
    },
    // 改变请求条数
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      this.loading = true;
      const parames = {
        data: {
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'create_time desc',
      };

      getListByCommand(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data.map((ele) => {
            ele.actualPaymentAmount = ele.statisticsAmountDto.actualPaymentAmount;
            ele.subpackageAmount = ele.statisticsAmountDto.subpackageAmount;
            ele.businessAmount = ele.statisticsAmountDto.businessAmount;

            return ele;
          });
          this.page.total = total;
          this.loading = false;
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    // 预览
    openDialog(state, info = {}) {
      const title = {
        collectionDetail: '收款金额详情列表',
        invoicePayLogDetail: '暂估应付金额详情列表',
        paymentAmountDetail: '付款金额详情列表',
        cooperationInvoice: '合作发票录入',
        financialAccount: '列账金额详情列表',
        baseInfo: '项目财务详情展示',
        projectDetailShow: '项目详情展示',
      };
      const width = {
        collectionDetail: '1150px',
        invoicePayLogDetail: '1150px',
        paymentAmountDetail: '1150px',
        cooperationInvoice: '1250px',
        financialAccount: '1150px',
        baseInfo: '1150px',
        projectDetailShow: '1250px',
      };

      this.editTitle = title[info.type];
      this.editWidth = width[info.type];
      this.editshow = true;
      this.editdata = info;
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },

    handleSuccess() {
      this.editshow = false;
      this.getDataAllList();
    },
  },
};
</script>

<style scoped lang="less">
.financeLedger {
  /deep/ .canClick {
    cursor: pointer;
    color: #4caae0;
  }
}
</style>
