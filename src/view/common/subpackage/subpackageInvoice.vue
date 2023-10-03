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
            :selection="false"
            reserveSelection
            :row-key="getRowKey"
            :page-current="page.current"
            :total="page.total"
            :showPage="false"
            :expand="true"
            :page-size="page.pageSize"
            @row-current-change="handleRowChange"
            @current-change="onCurrentChange"
            @size-change="onPageSizeChange"
          >
            <template slot-scope="scope" slot="expand">
              <div class="expandInfo">
                <page-table
                  class="childPageTable"
                  ref="childPageTable"
                  col-align="left"
                  :showPage="false"
                  :selection="true"
                  :operator="false"
                  :row-key="getRowKey"
                  :data="tableData[scope.index].writeOffInvoiceRelationDetailList"
                  hideDefaultIndex
                  :cols="expandTableCols"
                  @selection-change="(args) => onSelectionChange(tableData[scope.index], args)"
                >
                </page-table>
              </div>
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
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import headerTitle from '@/components/headerTitle/headerTitle';
import searchForm from '@/components/searchForm/searchForm.vue';
import PageTable from '@/components/page-table';
import { getInvoiceList } from '@/api/user';
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
          label: '分包发票代码',
          props: {
            fieldName: 'invoiceCode',
          },
        },
        {
          type: 'input',
          label: '分包发票号码',
          props: {
            fieldName: 'invoiceNumber',
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      selectTable: {}, // 选中表格数据
      tableData: [
        // {
        //   id: 1,
        //   invoiceNumber: '1',
        //   createTime: '2022-09-09 20:20:00',
        //   invoiceCode: '11',
        //   invoiceNumber: '11',
        //   noTaxAmount: '13',
        //   writeOffInvoiceRelationDetailList: [
        //     {
        //       id: 11,
        //       allocationAmount: '1111',
        //       amountToBeWrittenOff: '1111',
        //       amountType: '1',
        //       contractName: '1111',
        //       erpNumber: '1111',
        //     },
        //   ],
        // },
        // {
        //   id: 2,
        //   invoiceNumber: '2',
        //   createTime: '2022-09-09 20:20:00',
        //   invoiceCode: '22',
        //   invoiceNumber: '22',
        //   noTaxAmount: '23',
        //   writeOffInvoiceRelationDetailList: [
        //     {
        //       id: 22,
        //       allocationAmount: '2222',
        //       amountToBeWrittenOff: '2222',
        //       amountType: '2',
        //       contractName: '2222',
        //       erpNumber: '2222',
        //     },
        //   ],
        // },
      ],
      tableCols: [
        {
          label: '虚拟发票',
          prop: 'invoiceNumber',
          render: (h, scope) => {
            const fictitiousInvoice = this.common().isJudge.filter(
              (status) => status.id === scope.row.fictitiousInvoice,
            );

            return <div>{fictitiousInvoice && fictitiousInvoice[0] && fictitiousInvoice[0].name}</div>;
          },
        },
        {
          label: '发票类型',
          prop: 'erpNumber',
          hide: true,
        },
        {
          label: '开票日期',
          prop: 'createTime',
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
          label: '发票金额(不含税)',
          prop: 'noTaxAmount',
        },
        {
          label: '税率(%)',
          prop: 'rate',
          render: (h, scope) => {
            const useItem = this.common().taxRateCode.filter((status) => status.id === scope.row.rate);

            return <div>{useItem && useItem[0] && useItem[0].name}</div>;
          },
        },
        {
          label: '发票税额',
          prop: 'taxAmount',
        },
        {
          label: '发票金额(含税)',
          prop: 'invoiceAmount',
        },
        {
          label: '发票剩余分配金额',
          prop: 'invoiceBalance',
          hide: true,
        },
        {
          label: '已分配金额',
          prop: 'amountAllocated',
        },
        {
          label: '发票剩余金额',
          prop: 'invoiceBalance',
        },
        {
          label: '已核销金额',
          prop: 'amountWrittenOff',
        },
        {
          label: '待核销金额',
          prop: 'amountToBeWrittenOff',
        },
      ],
      expandTableCols: [
        {
          label: '待核销金额',
          prop: 'amountToBeWrittenOff',
        },
        {
          label: '分配金额',
          prop: 'allocationAmount',
        },
        {
          label: '合作合同名称',
          prop: 'contractName',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
        },
        {
          label: '费用类型',
          prop: 'amountType',
          hide: true,
        },
        {
          label: '承揽订单',
          prop: 'orderName',
        },
      ],
      selectTables: [],
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
      if (this.data.parames) {
        const { projectType } = this.data.parames;
        const projectTypeItem = this.common().projectType.filter((project) => project.id === projectType);

        if (projectTypeItem[0].name === '协作') {
          this.expandTableCols[4].hide = true;
        }
      }
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
          selectSource: this.data.selectSource,
          erpNumber: this.data.erpNumber,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getInvoiceList({
        ...this.searchVal,
        ...this.data.parames,
      }).then((res) => {
        if (res && res.code === '200') {
          this.tableData = res.data;
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
    onSelectionChange(tableItem, selectTables) {
      const findIndex = this.selectTables.findIndex((selectItem) => selectItem.id === tableItem.id);

      console.log('this.selectTables[findIndex]', this.selectTables[findIndex]);
      console.log('selectTables', selectTables, findIndex);
      if (findIndex > -1) {
        this.selectTables[findIndex] = {
          ...tableItem,
          writeOffInvoiceRelationDetailList: (
            this.selectTables[findIndex].writeOffInvoiceRelationDetailList || []
          ).concat(selectTables),
        };
      } else {
        this.selectTables.push({
          ...tableItem,
          writeOffInvoiceRelationDetailList: selectTables,
        });
      }
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
      this.$emit('success', this.selectTables);
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
  .comp-page-table {
    min-height: auto;
    td {
      &.el-table__expanded-cell {
        padding-left: 48px;
        padding-top: 0;
        padding-bottom: 0;
        border-right: none;
      }
    }
    &.childPageTable {
      padding: 0;
      border: 1px solid #fce8e0;
      border-top: none;
      border-right: none;
      border-bottom: none;
      margin-bottom: 0;
      th {
        background: #fff2ed !important;
        border-color: #fce8e0;
      }
      tbody {
        tr {
          td {
            border-color: #fce8e0;
          }
          &:nth-of-type(2n) {
            background: #fffbfa;
          }
        }
      }
    }
  }
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
