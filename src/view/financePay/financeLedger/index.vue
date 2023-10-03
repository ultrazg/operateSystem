<template>
  <div class="financeLedger">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
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
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="财务列账"
                icon="iconfont icon-bianji"
                v-if="$_hasOperation(routerCode, 'edit')"
                @click.prevent.stop="
                  openDialog('financialAccount', {
                    row: scope.row,
                    type: 'financialAccount',
                    configType: 'edit',
                  })
                "
              >
                财务列账
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
import { getListByCommand } from '@/api/financePay/financeLedger';
export default {
  name: 'financeLedger',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        name: undefined,
        erpNumber: undefined,
      },
      searchItems: [
        {
          type: 'input',
          label: '项目名称',
          initValue: '',
          props: {
            fieldName: 'name',
          },
        },
        {
          type: 'input',
          label: 'ERP编号',
          initValue: '',
          props: {
            fieldName: 'erpNumber',
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
                    this.openDialog('detail', {
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
          label: '付款金额',
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
              scope.row.actualPaymentAmount,
            ),
        },
        {
          label: '合作发票金额',
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
              scope.row.subpackageAmount,
            ),
        },
        {
          label: '预缴税金',
          prop: 'salesVolume',
          align: 'center',
        },
        {
          label: '列账金额',
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
              scope.row.businessAmount,
            ),
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: 200,
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
        financialAccount: '财务列账操作',
        paymentAmountDetail: '付款金额详情列表',
        cooperationInvoice: '合作发票录入',
        projectDetailShow: '项目详情展示',
      };
      const width = {
        financialAccount: '1150px',
        paymentAmountDetail: '1150px',
        cooperationInvoice: '1250px',
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
