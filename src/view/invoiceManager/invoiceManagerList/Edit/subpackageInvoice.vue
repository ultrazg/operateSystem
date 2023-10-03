<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="`${title}`"
    width="950px"
    :visible.sync="dialogShow"
    :appendToBody="true"
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
            :hideDefaultIndex="true"
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
import { getSubpackageInvoiceForInvoice } from '@/api/invoiceManager/invoiceIndex';
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
    blueAddData: {
      type: Object,
    },
  },
  data() {
    return {
      // consignor: '',
      scrollHeight: 'auto',
      title: '分包发票选择',
      searchVal: {
        subBathId: '',
      },
      searchItems: [
        {
          type: 'input',
          label: '子批次号',
          props: {
            fieldName: 'subBathId',
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
          label: '本批次含税价(合计)',
          prop: 'totalTaxPriceAmount',
          align: 'center',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          align: 'center',
        },
        {
          label: '子批次号',
          prop: 'subBathId',
          align: 'center',
        },
        {
          label: '项目名称',
          prop: 'name',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.name),
        },
        {
          label: '省份',
          prop: 'province',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.province),
        },
        {
          label: '地市',
          prop: 'city',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.city),
        },
        {
          label: '一级专业',
          prop: 'oneMajor',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.oneMajor),
        },
        {
          label: '二级专业',
          prop: 'twoMajor',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.twoMajor),
        },
        {
          label: '项目经理',
          prop: 'manager',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.manager),
        },
        {
          label: '委托方',
          prop: 'consignor',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.consignor),
        },
        {
          label: '主体',
          prop: 'subject',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.subject),
        },
        {
          label: '描述',
          prop: 'remark',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.remark),
        },
        {
          label: '预估收入',
          prop: 'estimatedRevenue',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.estimatedRevenue),
        },
        {
          label: '预估成本',
          prop: 'estimatedCost',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.estimatedCost),
        },
        {
          label: '计划开工',
          prop: 'startTime',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.startTime),
        },
        {
          label: '计划完工',
          prop: 'endTime',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.endTime),
        },
        {
          label: '部门',
          prop: 'deptId',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.deptId),
        },
        {
          label: '设计单位',
          prop: 'designUnit',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.designUnit),
        },
        {
          label: '监理单位',
          prop: 'supervisionUnit',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.supervisionUnit),
        },
        {
          label: '建设单位项目经理',
          prop: 'constructManager',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.constructManager),
        },
        {
          label: '建设单位项目经理联系方式',
          prop: 'constructManagerContact',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.constructManagerContact),
        },
        {
          label: '监理联系人',
          prop: 'subBathId',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.startTime),
        },
        {
          label: '监理联系方式',
          prop: 'subBathId',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.startTime),
        },
        {
          label: '备注',
          prop: 'subBathId',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.projectApprovalDto.startTime),
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
  watch: {
    blueAddData: {
      handler(val) {
        // const { row } = this.blueAddData;
        // this.consignor = row.construction;
      },
      deep: true,
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
          consignor: this.blueAddData.row.construction,
          selectSource: 'blueAdd',
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getSubpackageInvoiceForInvoice(parames).then((res) => {
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
      this.$emit('success', this.selectTable);
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
