<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    appendToBody
    :customClass="customClass"
    :title="`${title}`"
    width="950px"
    :visible.sync="dialogShow"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <!-- 搜索框 -->
      <header-title>
        <search-form
          ref="searchForm"
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
          @onChange="onChange"
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
            highlightCurrentRow
            reserveSelection
            :row-key="getRowKey"
            :page-current="page.current"
            :total="page.total"
            :page-size="page.pageSize"
            :showPage="false"
            @row-current-change="handleRowChange"
            @current-change="onCurrentChange"
            @size-change="onPageSizeChange"
            hideDefaultIndex
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
import { contractList } from '@/api/spliptInvoice/subpackageBatchManagement/distribution';
export default {
  name: 'instionContractSelect',
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
    typeData: {
      type: Object,
      default: () => ({}),
    },
    customClass: {
      type: String,
      default: '',
    },
  },
  inject: ['common'],
  data() {
    return {
      scrollHeight: 'auto',
      searchVal: {
        costType: '1',
      },
      title: '',
      searchItems: [
        {
          type: 'select',
          label: '费用类型',
          labelWidth: '80px',
          initValue: '1',
          props: {
            fieldName: 'costType',
            filterable: true,
            noAllOption: true,
            options: this.common().instionFeeType,
          },
        },
        {
          type: 'input',
          label: '合作合同名称',
          labelWidth: '100px',
          props: {
            fieldName: 'contractName',
            filterable: true,
          },
        },
        {
          type: 'input',
          label: 'ERP编号',
          labelWidth: '80px',
          props: {
            fieldName: 'erpNumber',
            filterable: true,
          },
        },
        {
          type: 'input',
          label: '站点名称',
          labelWidth: '80px',
          props: {
            fieldName: 'stationName',
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
          label: '成本类型',
          prop: 'costType',
          render: (h, scope) => {
            const useItem = this.common().instionFeeType.filter((status) => status.id === scope.row.costType);

            return <div>{useItem && useItem[0] && useItem[0].name}</div>;
          },
        },
        {
          label: '地市',
          prop: 'city',
          render: (h, scope) => {
            const useItem = this.common().cityErpByParentCode.filter((status) => status.id === scope.row.city);

            return <div>{useItem && useItem[0] && useItem[0].name}</div>;
          },
        },
        {
          label: '站点名称',
          prop: 'stationName',
        },
        {
          label: '站点类型',
          prop: 'stationType',
          render: (h, scope) => {
            const useItem = this.common().stationType.filter((status) => status.id === scope.row.stationType);

            return <div>{useItem && useItem[0] && useItem[0].name}</div>;
          },
        },
        {
          label: '合同编号',
          prop: 'contractId',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
        },
        {
          label: '起始日期',
          prop: 'startTime',
        },
        {
          label: '截止日期',
          prop: 'endTime',
        },
        {
          label: '电费总成本',
          prop: 'amountAll',
        },
        {
          label: '站点剩余开票金额',
          width: '120px',
          prop: 'remainingInvoicedAmount',
        },
      ],
    };
  },
  watch: {
    typeData(val) {
      if (this.dialogShow) {
        this.openedit();
      }
    },
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
      this.title = '选择以租代建项目费用类型合同';
      this.tableCols[8].label = '服务费总成本';
      this.onSearch();
    },
    // 搜索
    onSearch(val) {
      this.searchVal = {
        ...this.searchVal,
        ...val,
        contractType: this.typeData.id,
      };
      this.onCurrentChange(1);
    },
    onChange(val) {
      if (val.costType !== this.searchVal.costType) {
        if (val.costType === '0') {
          this.tableCols[8].label = '电费总成本';
        } else {
          this.tableCols[8].label = '服务费总成本';
        }
        this.onSearch(val);
      }
      this.searchVal = {
        ...val,
      };
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

      contractList(this.searchVal).then((res) => {
        if (res.code === '200') {
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
      this.selectTable = {
        data: this.data,
        ...row,
      };
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
        ...this.selectTable,
        amountType: this.searchVal.costType,
      });
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
