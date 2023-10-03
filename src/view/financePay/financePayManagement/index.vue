<template>
  <div class="financePayManagement">
    <wrapper :key="'firstTable'" :title="'暂估应付核销'" :isFold="false">
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
            :selection="false"
            :operator="true"
            :hideDefaultIndex="true"
            reserveSelection
            highlightCurrentRow
            :row-key="getRowKey"
            :page-current="page.current"
            :total="page.total"
            :page-size="page.pageSize"
            :tableHeight="220"
            @current-change="onCurrentChange"
            @row-current-change="handleRowChange"
            @size-change="onPageSizeChange"
          >
            <template slot-scope="scope" slot="operator">
              <flex>
                <el-button
                  type="text"
                  size="small"
                  title="付款"
                  icon="iconfont icon-yingfu"
                  v-if="$_hasOperation(routerCode, 'edit')"
                  @click.prevent.stop="
                    openDialog('add', {
                      row: scope.row,
                      type: 'handle',
                      configType: 'add',
                    })
                  "
                >
                  付款
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
    </wrapper>
    <wrapper :key="'secondTable'" :title="'项目付款明细'" :isFold="false">
      <!-- 页面 -->
      <div class="Modeltable">
        <page-table
          ref="secondTable"
          col-align="left"
          operator-width="110"
          :data="paymentDetailsTable"
          :cols="paymentDetailsCols"
          :selection="false"
          :operator="true"
          :hideDefaultIndex="true"
          reserveSelection
          :row-key="getRowKey"
          :page-current="paymentDetailsPage.current"
          :total="paymentDetailsPage.total"
          :page-size="paymentDetailsPage.pageSize"
          :tableHeight="220"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="修改"
                icon="iconfont icon-bianji"
                v-if="(scope.row.status === '1' || scope.row.status === '4') && $_hasOperation(routerCode, 'detail')"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'edit',
                  })
                "
              >
                修改
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
    </wrapper>
    <edit
      :show="editshow"
      :data="editdata"
      :title="editTitle"
      :width="editWidth"
      @cancel="closeEdit"
      @success="successEdit"
    />
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import searchForm from 'components/searchForm/searchForm';
import Flex from '@/components/flex';
import headerTitle from 'components/headerTitle/headerTitle';
import Edit from './Edit';
import { getFinancePayList, getInvoiceActualPaymentList } from '@/api/financePay/financePayManagement';
export default {
  name: 'financePayManagement',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        erpNumber: '',
        name: '',
      },
      searchItems: [
        {
          type: 'input',
          label: 'ERP编号',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'erpNumber',
          },
        },
        {
          type: 'input',
          label: '项目名称',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'name',
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
          label: 'ERP编号',
          prop: 'erpNumber',
          align: 'center',
        },
        {
          label: '项目名称',
          prop: 'name',
          align: 'center',
        },
        {
          label: '累计开票金额',
          prop: 'invoiceAmount',
          align: 'center',
        },
        {
          label: '收款金额',
          prop: 'receiveAmount',
          align: 'center',
        },
        {
          label: '暂估应付金额',
          prop: 'estimatePayAmount',
          align: 'center',
        },
        {
          label: '已付金额',
          prop: 'actualPaymentAmount',
          align: 'center',
        },
        {
          label: '列账金额',
          prop: 'businessAmount',
          align: 'center',
        },
      ],
      paymentDetailsPage: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      paymentDetailsTable: [],
      paymentDetailsCols: [
        {
          label: '来源',
          prop: 'sourceFromName',
          align: 'center',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          align: 'center',
        },
        {
          label: '报账单号',
          prop: 'paymentNumber',
          align: 'center',
        },
        {
          label: '日期',
          prop: 'createTime',
          align: 'center',
        },
        {
          label: '操作人',
          prop: 'createPeople',
          align: 'center',
        },
        {
          label: '状态',
          prop: 'statusName',
          align: 'center',
        },
        {
          label: '已付金额',
          prop: 'paymentAmount',
          align: 'center',
        },
      ],
      editshow: false,
      editdata: {},
      selectErpNumber: '',
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
    Wrapper,
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
      this.onPaymentCurrentChange(1);
    },
    // 请求某页数据
    onCurrentChange(val) {
      this.$refs.pageTable.clearCurrentRow();
      this.page.current = val;
      this.getFinancePayData();
    },
    // 改变请求条数
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getFinancePayData() {
      this.loading = true;
      const parames = {
        data: {
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'create_time desc',
      };

      getFinancePayList(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data.map((ele) => {
            ele.actualPaymentAmount = ele.statisticsAmountDto.actualPaymentAmount;
            ele.businessAmount = ele.statisticsAmountDto.businessAmount;
            ele.estimatePayAmount = ele.statisticsAmountDto.estimatePayAmount;
            ele.invoiceAmount = ele.statisticsAmountDto.invoiceAmount;
            ele.receiveAmount = ele.statisticsAmountDto.receiveAmount;

            return ele;
          });
          this.page.total = total;
          this.loading = false;
        }
      });
    },

    // 请求某页数据
    onPaymentCurrentChange(val) {
      this.paymentDetailsPage.current = val;
      this.getPaymentData();
    },
    // 改变请求条数
    onPaymentPageSizeChange(val) {
      this.paymentDetailsPage.pageSize = val;
      this.onPaymentCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getPaymentData() {
      const parames = {
        data: {
          erpNumber: this.selectErpNumber,
        },
        pageNo: this.paymentDetailsPage.current,
        pageSize: this.paymentDetailsPage.pageSize,
        sorting: 'id desc',
      };

      getInvoiceActualPaymentList(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.paymentDetailsTable = data;
          this.paymentDetailsPage.total = total;
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
        add: '核销执行',
        edit: '核销执行',
      };
      const width = {
        add: '1150px',
        edit: '1150px',
      };

      this.editTitle = title[info.configType];
      this.editWidth = width[info.configType];
      this.editshow = true;
      this.editdata = info;
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },

    successEdit() {
      this.editshow = false;
      this.getFinancePayData();
      this.onPaymentCurrentChange(1);
    },
    // 入参添加列表选中
    handleRowChange(row) {
      console.log(row, 'sortKey值');
      this.selectErpNumber = row ? row.erpNumber : '';
      this.onPaymentCurrentChange(1);
    },
  },
};
</script>

<style scoped lang="less">
.financePayManagement {
  #headerTitle {
    /deep/ .searchBox {
      margin-bottom: 0;
      box-shadow: unset;
      border-bottom: none;
    }
  }
  .content-view {
    /deep/ .comp-page-table {
      padding-top: 0;
      border-top: 0;
    }
  }
  .comp-page-table {
    min-height: unset;
  }
}
</style>
