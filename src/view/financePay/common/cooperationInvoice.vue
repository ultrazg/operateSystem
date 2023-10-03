<template>
  <div class="cooperationInvoice">
    <div class="btn-list">
      <span class="add-btn" @click="openDialog">新增</span>
    </div>
    <Flex>
      <div class="cooperationInvoice_left">
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
                :data="tableData"
                :cols="tableCols"
                :selection="false"
                :operator="false"
                :hideDefaultIndex="true"
                reserveSelection
                highlightCurrentRow
                :row-key="getRowKey"
                :page-current="page.current"
                :total="page.total"
                :page-size="page.pageSize"
                :page-layout="page.layout"
                :tableHeight="220"
                @current-change="onCurrentChange"
                @row-current-change="handleRowChange"
                @size-change="onPageSizeChange"
              >
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
      </div>
      <div class="cooperationInvoice_right">
        <wrapper :key="'secondTable'" :title="'项目批次信息'" :isFold="false">
          <!-- 页面 -->
          <div class="content-view">
            <div class="Modeltable">
              <page-table
                ref="rightTopTable"
                col-align="left"
                operator-width="110"
                :data="rightTopTable"
                :cols="rightTopTableCols"
                :selection="false"
                :operator="false"
                :hideDefaultIndex="true"
                :showSummary="true"
                reserveSelection
                :row-key="getRowKey"
                :summaryMethod="rightTopSummaryMethod"
                :page-current="rightTopPage.current"
                :total="rightTopPage.total"
                :page-size="rightTopPage.pageSize"
                @current-change="onRightTopCurrentChange"
                @size-change="onRightTopPageSizeChange"
              >
              </page-table>
            </div>
          </div>
          <div class="content-view">
            <div class="Modeltable">
              <page-table
                ref="rightBottomTable"
                col-align="left"
                operator-width="110"
                :data="rightBottomTable"
                :cols="rightBottomTableCols"
                :selection="false"
                :operator="false"
                :hideDefaultIndex="true"
                :showSummary="true"
                reserveSelection
                :row-key="getRowKey"
                :summaryMethod="rightBottomSummaryMethod"
                :page-current="rightBottomPage.current"
                :total="rightBottomPage.total"
                :page-size="rightBottomPage.pageSize"
                @current-change="onCurrentChange"
                @size-change="onPageSizeChange"
              >
              </page-table>
            </div>
          </div>
        </wrapper>
      </div>
    </Flex>
    <cooperation-invoice-add :show="editshow" :data="editdata" @cancel="closeEdit" @success="successEdit" />
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import searchForm from 'components/searchForm/searchForm';
import Flex from '@/components/flex';
import headerTitle from 'components/headerTitle/headerTitle';
import cooperationInvoiceAdd from './cooperationInvoiceAdd';
import {
  batchListByCondition,
  getSubpackageInvoiceBatchListByCondition,
  getSubpackageInvoiceActualListByCondition,
} from '@/api/financePay/common';
export default {
  name: 'cooperationInvoice',
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    Wrapper,
    cooperationInvoiceAdd,
  },
  props: {
    data: {},
  },
  data() {
    return {
      searchVal: {
        erpNumber: '',
      },
      searchItems: [
        {
          type: 'input',
          label: 'ERP编号',
          initValue: this.data.row.erpNumber,
          labelWidth: '60px',
          disabled: true,
          props: {
            fieldName: 'erpNumber',
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
        layout: 'prev, pager, next',
      },
      tableData: [],
      tableCols: [
        {
          label: '发票批次',
          prop: 'batchId',
          align: 'center',
        },
      ],
      rightTopPage: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      rightTopTable: [],
      rightTopTableCols: [
        {
          label: '发票批次',
          prop: 'batchId',
          align: 'center',
        },
        {
          label: '归属项目号',
          prop: 'erpNumber',
          align: 'center',
        },
        {
          label: '合同名称',
          prop: 'contractName',
          align: 'center',
        },
        {
          label: '本批次含税价',
          prop: 'totalTaxPriceAmount',
          align: 'center',
        },
        {
          label: '本批次不含税金额',
          prop: 'totalTaxFreeAmount',
          align: 'center',
        },
        {
          label: '本批次税额',
          prop: 'totalTaxAmount',
          align: 'center',
        },
        {
          label: '税率',
          prop: 'taxRate',
          align: 'center',
        },
        {
          label: '开发票单位',
          prop: 'invoiceUnit',
          align: 'center',
        },
        {
          label: '发票类型',
          prop: 'invoiceType',
          align: 'center',
        },
        {
          label: '收到发票张数',
          prop: 'count',
          align: 'center',
        },
        {
          label: '子批次号',
          prop: 'subBathId',
          align: 'center',
        },
      ],
      rightBottomPage: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      rightBottomTable: [],
      rightBottomTableCols: [
        {
          label: '发票批次',
          prop: 'batchId',
          align: 'center',
        },
        {
          label: '分包发票代码',
          prop: 'invoiceCode',
          align: 'center',
        },
        {
          label: '分包发票号码',
          prop: 'invoiceNumber',
          align: 'center',
        },
        {
          label: '本章发票含税价',
          prop: 'taxPriceAmount',
          align: 'center',
        },
        {
          label: '本章发票不含税金额',
          prop: 'taxFreeAmount',
          align: 'center',
        },
        {
          label: '本章发票税额',
          prop: 'taxAmount',
          align: 'center',
        },
        {
          label: '虚拟发票',
          prop: 'virtualType',
          align: 'center',
        },
        {
          label: '开票日期',
          prop: 'invoiceDate',
          align: 'center',
        },
        {
          label: '备注',
          prop: 'remark',
          align: 'center',
        },
      ],
      editshow: false,
      editdata: {},
      batchId: '',
      editTitle: '',
      editWidth: '900px',
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.onSearch({ erpNumber: this.data.row.erpNumber });
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
      this.$refs.pageTable.clearCurrentRow();
      this.page.current = val;
      this.getLeftTableData();
    },
    // 改变请求条数
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getLeftTableData() {
      const parames = {
        data: {
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      batchListByCondition(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
        }
      });
    },

    // 请求某页数据
    onRightTopCurrentChange(val) {
      this.rightTopPage.current = val;
      this.getRightTopData();
    },
    // 改变请求条数
    onRightTopPageSizeChange(val) {
      this.rightTopPage.pageSize = val;
      this.onRightTopCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getRightTopData() {
      const parames = {
        data: {
          batchId: this.batchId,
        },
        pageNo: this.rightTopPage.current,
        pageSize: this.rightTopPage.pageSize,
        sorting: 'id desc',
      };

      getSubpackageInvoiceBatchListByCondition(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.rightTopTable = data;
          this.rightTopPage.total = total;
        }
      });
    },

    // 请求某页数据
    onRightBottomCurrentChange(val) {
      this.rightBottomPage.current = val;
      this.getRightBottomData();
    },
    // 改变请求条数
    onRightBottomPageSizeChange(val) {
      this.rightBottomPage.pageSize = val;
      this.onRightBottomCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getRightBottomData() {
      const parames = {
        data: {
          batchId: this.batchId,
        },
        pageNo: this.rightBottomPage.current,
        pageSize: this.rightBottomPage.pageSize,
        sorting: 'id desc',
      };

      getSubpackageInvoiceActualListByCondition(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.rightBottomTable = data;
          this.rightBottomPage.total = total;
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    // 预览
    openDialog() {
      console.log('add');
      this.editshow = true;
      this.editdata = {};
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },

    successEdit() {
      this.editshow = false;
      this.getLeftTableData();
    },
    // 入参添加列表选中
    handleRowChange(row) {
      console.log(row, 'sortKey值');
      this.batchId = row ? row.batchId : '';
      this.onRightTopCurrentChange(1);
      this.onRightBottomCurrentChange(1);
    },

    rightTopSummaryMethod(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';

          return;
        }
        const values = data.map((item) => Number(item[column.property]));

        if (column.property === 'totalTaxFreeAmount') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);

            if (!isNaN(value)) {
              return prev + curr;
            }

            return prev;
          }, 0);
          sums[index] = sums[index].toFixed(2);
          this.totalMoney = sums[index];
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },

    rightBottomSummaryMethod(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';

          return;
        }
        const values = data.map((item) => Number(item[column.property]));

        if (column.property === 'taxFreeAmount') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);

            if (!isNaN(value)) {
              return prev + curr;
            }

            return prev;
          }, 0);
          sums[index] = sums[index].toFixed(2);
          this.totalMoney = sums[index];
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
  },
};
</script>

<style scoped lang="less">
.cooperationInvoice {
  .btn-list {
    text-align: right;
    .add-btn {
      display: inline-block;
      padding: 4px 20px;
      color: #fff;
      background: linear-gradient(135deg, #f7660d 5%, #f00a00 100%);
      margin-bottom: 8px;
      cursor: pointer;
    }
  }
  &_left {
    width: 200px;
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
  }
  &_right {
    width: calc(100% - 200px);
    margin-left: 20px;
    .comp-page-table {
      min-height: unset;
    }
  }
}
</style>
