<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    customClass="subpackageInvoiceDialog"
    appendToBody
    :title="`${title}`"
    width="950px"
    :visible.sync="dialogShow"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <!-- 搜索框 -->
      <header-title>
        <search-form ref="searchForm" slot="searchBox" :searchItems="searchItems" @onSearch="onSearch" />
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
            :highlightCurrentRow="highlightCurrentRow"
            :selection="!highlightCurrentRow"
            reserveSelection
            :row-key="getRowKey"
            :page-current="page.current"
            :total="page.total"
            :showPage="false"
            :page-size="page.pageSize"
            @selection-change="onSelectionChange"
            @row-current-change="handleRowChange"
            @current-change="onCurrentChange"
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
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import headerTitle from '@/components/headerTitle/headerTitle';
import searchForm from '@/components/searchForm/searchForm.vue';
import PageTable from '@/components/page-table';
import { subpackagePage } from '@/api/receivableManagement/receivableEnter';
export default {
  name: 'subpackageInvoice',
  components: {
    dialogCont,
    headerTitle,
    searchForm,
    PageTable,
  },
  props: {
    data: {},
    show: {
      type: Boolean,
      default: false,
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true,
    },
  },
  inject: ['common'],
  data() {
    return {
      scrollHeight: 'auto',
      title: '分包发票选择',
      searchVal: {
        username: undefined,
        realName: undefined,
      },
      searchItems: [
        {
          type: 'input',
          label: 'ERP编号',
          labelWidth: '70px',
          props: {
            fieldName: 'erpNumber',
          },
        },
        {
          type: 'input',
          label: '承揽订单',
          labelWidth: '70px',
          props: {
            fieldName: 'orderId',
          },
        },
        {
          type: 'input',
          label: '分包发票代码',
          labelWidth: '90px',
          props: {
            fieldName: 'invoiceCode',
          },
        },
        {
          type: 'input',
          label: '合作合同名称',
          labelWidth: '90px',
          props: {
            fieldName: 'contractName',
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      selectTable: {}, // 选中表格数据
      tableData: [],
      tableCols: [
        {
          label: 'ERP编号',
          prop: 'erpNumber',
        },
        {
          label: '承揽订单',
          prop: 'orderId',
        },
        {
          label: '承揽订单金额',
          prop: 'contractAmount',
        },
        {
          label: '对应总包金额',
          prop: 'totalContractAmount',
        },
        {
          label: '总包剩余分配金额',
          prop: 'remainderDistributeAmount',
        },
        {
          label: '分包发票代码',
          prop: 'invoiceCode',
        },
        {
          label: '分包发票号码',
          prop: 'invoiceNumber',
        },
        {
          label: '分配金额',
          prop: 'distributeAmount',
        },
        {
          label: '合作合同名称',
          prop: 'contractName',
        },
        {
          label: '费用类型',
          prop: 'amountType',
        },
      ],
    };
  },
  computed: {
    dialogShow: {
      get() {
        return this.show;
      },
      set(v) {
        console.log('set');
      },
    },
  },
  methods: {
    openedit() {
      this.onSearch();
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
    // 获取所有/查询数据列表
    getDataAllList() {
      const parames = {
        data: {
          ...this.searchVal,
          consignor: this.data.consignor,
          projectType: this.data.projectType,
          costType: this.data.costType,
          // consignor: '91130000731401289K',
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      subpackagePage(parames).then((res) => {
        if (res && res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
        }
      });
    },
    // 改变请求条数
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 入参添加列表选中
    handleRowChange(row) {
      console.log(row, 'sortKey值');
      this.selectTable = row;
    },
    onSelectionChange(args) {
      this.selectTable = args;
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    closeedit() {
      this.canceledit();
    },
    canceledit(type) {
      this.$emit('cancel', type);
    },
    confirmedit() {
      this.closeedit();
      this.$emit('success', this.selectTable);
      this.$nextTick(() => {
        this.$refs.pageTable.clearCurrentRow();
      });
    },
    successSubmit() {
      this.closeedit();
      this.$emit('success');
      this.$nextTick(() => {
        this.$refs.pageTable.clearCurrentRow();
      });
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~'>>>';

@{deep}.el-dialog__body {
  padding-right: 4px;
}
.scrollView {
  overflow: hidden;
  overflow-y: auto;
  padding-right: 10px;
  // 重写滚动条样式
  &::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    //滚动条的宽度
    width: 4px;
    height: 4px;
    border-radius: 2px;
    margin-right: 2px;
    position: relative;
  }
  &::-webkit-scrollbar-thumb {
    //滚动条的设置
    background: #d5d5d5;
    background-clip: padding-box;
    min-height: 28px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #d5d5d5;
  }
}
</style>
<style lang="less">
.subpackageInvoiceDialog {
  .el-table__expanded-cell {
    border: none;
    border-bottom: none;
    padding: 0;
    .expandInfo {
      padding: 0;
      .comp-page-table {
        min-height: auto;
        margin-bottom: 0;
        padding: 0;
      }
    }
  }
}
</style>
