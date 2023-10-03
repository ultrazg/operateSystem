<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    customClass="invoiceRedDialog"
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
import { getReceivableBatchInfo } from '@/api/receivableManagement/invoiceRedManagement';
export default {
  name: 'invoiceRed',
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
      title: '选择应收发票批次',
      searchVal: {
        username: undefined,
        realName: undefined,
      },
      searchItems: [
        {
          type: 'input',
          label: '应收发票批次',
          labelWidth: '100px',
          props: {
            fieldName: 'receivableBatchNumber',
          },
        },
        {
          type: 'input',
          label: '应收发票批次名称',
          labelWidth: '120px',
          props: {
            fieldName: 'receivableBatchName',
          },
        },
        {
          type: 'select',
          label: '委托方',
          labelWidth: '70px',
          props: {
            fieldName: 'consignor',
            filterable: true,
            options: this.common().constructionCode,
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
          label: '应收发票批次',
          prop: 'receivableBatchNumber',
        },
        {
          label: '应收发票批次名称',
          prop: 'receivableBatchName',
        },
        {
          label: '委托方',
          prop: 'consignor',
        },
        {
          label: '实际分配金额(含税)',
          prop: 'receivableDistributeAmount',
        },
        {
          label: '实际分配金额(不含税)',
          prop: 'distributionAmountNoTax',
        },
        {
          label: '税额',
          prop: 'taxAmount',
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
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getReceivableBatchInfo(parames).then((res) => {
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
.invoiceRedDialog {
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
