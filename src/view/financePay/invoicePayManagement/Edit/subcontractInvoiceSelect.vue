<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
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
            highlightCurrentRow
            reserveSelection
            :row-key="getRowKey"
            :page-current="page.current"
            :total="page.total"
            :page-size="page.pageSize"
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
import { selectContractByCondition } from '@/api/financePay/invoicePayManagement';
export default {
  name: 'subcontractInvoiceSelect',
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
  },
  data() {
    return {
      scrollHeight: 'auto',
      title: '分包发票',
      searchVal: {
        subBathId: undefined,
      },
      searchItems: [
        {
          type: 'input',
          label: '子批次号',
          props: {
            fieldName: 'subBathId',
            filterable: true,
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
          label: '发票批次',
          prop: 'batchId',
        },
        {
          label: '合同名称',
          prop: 'contractName',
        },
        {
          label: '开发票单位',
          prop: 'invoiceUnit',
        },
        {
          label: '发票类型',
          prop: 'invoiceType',
        },
        {
          label: '收到发票张数',
          prop: 'count',
        },
        {
          label: '分包发票扫描件',
          prop: 'invoiceScanned',
        },
        {
          label: '本批次不含税金额',
          prop: 'totalTaxFreeAmount',
        },
        {
          label: '本批次税额',
          prop: 'totalTaxAmount',
        },
        {
          label: '本批次含税价',
          prop: 'totalTaxPriceAmount',
        },
        {
          label: '税率',
          prop: 'taxRate',
        },
        {
          label: '备注',
          prop: 'remark',
        },
        {
          label: 'ERP',
          prop: 'erpNumber',
        },
        {
          label: '子批次号',
          prop: 'subBathId',
        },
        {
          label: '归属项目号本次拆分金额',
          prop: 'subAmount',
        },
        {
          label: '归属项目号的列账单号',
          prop: 'billNumber',
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
          erpNumber: this.data.erpNumber,
          invoiceDetailId: this.data.invoiceDetailId,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      selectContractByCondition(parames).then((res) => {
        if (res.code === '200') {
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
      this.$emit('success', {
        row: this.selectTable,
        index: this.data.index,
      });
    },
    successSubmit() {
      this.closeedit();
      this.$emit('success');
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
