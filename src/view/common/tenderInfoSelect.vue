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
import { selectTenderInfoByConditions, deleteTenderInfoById, getExcel } from '@/api/marketMiddleStage/tenderInfoList';
export default {
  name: 'tenderInfoSelect',
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
      title: '投标选择',
      searchVal: {
        username: undefined,
        realName: undefined,
      },
      searchItems: [
        {
          type: 'input',
          label: '商机编号',
          initValue: '',
          props: {
            fieldName: 'busiId',
          },
        },
        {
          type: 'dataPicker',
          label: '开标时间起',
          initValue: '',
          labelWidth: '85px',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'startTime',
            placeholder: '请选择开始时间',
          },
        },
        {
          type: 'dataPicker',
          label: '开标时间止',
          labelWidth: '85px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'endTime',
            placeholder: '请选择结束时间',
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
          label: '所属生产中心',
          prop: 'productionCenter',
          width: 200,
          align: 'center',
        },
        {
          label: '商机编号',
          prop: 'busiId',
          width: 200,
          align: 'center',
        },
        {
          label: '投标申请编号',
          prop: 'tenderApplyId',
          width: 200,
          align: 'center',
        },
        {
          label: '项目信息概况',
          prop: 'busiName',
          width: 200,
          align: 'center',
        },
        {
          label: '项目采购形式',
          prop: 'purchaseModality',
          width: 200,
          align: 'center',
        },
        {
          label: '总标的金额(万元)',
          prop: 'projectScale',
          width: 200,
          align: 'center',
        },
        {
          label: '标段划分',
          prop: 'sectionDivision',
          width: 200,
          align: 'center',
        },
        {
          label: '项目归属',
          prop: 'projectBelong',
          width: 200,
          align: 'center',
        },
        {
          label: '市场类型',
          prop: 'marketType',
          width: 200,
          align: 'center',
        },
        {
          label: '招标单位名称',
          prop: 'custName',
          width: 200,
          align: 'center',
        },
        {
          label: '购买标书金额(万元)',
          prop: 'documentAmount',
          width: 200,
          align: 'center',
        },
        {
          label: '购买标书方式',
          prop: 'documentType',
          width: 200,
          align: 'center',
        },
        {
          label: '招标文件获取时间',
          prop: 'documentDate',
          width: 200,
          align: 'center',
        },
        {
          label: '投标时间',
          prop: 'tenderDate',
          width: 200,
          align: 'center',
        },
        {
          label: '采购编号',
          prop: 'purchaseId',
          width: 200,
          align: 'center',
        },
        {
          label: '招标代理',
          prop: 'biddingAgent',
          width: 200,
          align: 'center',
        },
        {
          label: '招标代理编号',
          prop: 'biddingAgentId',
          width: 200,
          align: 'center',
        },
        {
          label: '招标代理联系人及邮箱',
          prop: 'biddingAgentEmail',
          width: 200,
          align: 'center',
        },
        {
          label: '投标形式',
          prop: 'tenderType',
          width: 200,
          align: 'center',
        },
        {
          label: '投标责任人',
          prop: 'projectManager',
          width: 200,
          align: 'center',
        },
        {
          label: '投标保证金缴纳金额(万元)',
          prop: 'bondAmount',
          width: 200,
          align: 'center',
        },
        {
          label: '投标保证金缴纳时间',
          prop: 'bondDate',
          width: 200,
          align: 'center',
        },
        {
          label: '投标保证金报账单编号',
          prop: 'bondSheetId',
          width: 200,
          align: 'center',
        },
        {
          label: '投标保证金退还时间',
          prop: 'bondReturnDate',
          width: 200,
          align: 'center',
        },
        {
          label: '投标保证金退还金额(万元)',
          prop: 'bondCancel',
          width: 200,
          align: 'center',
        },
        {
          label: '投标保证金是否已核销',
          prop: 'bondIsCancel',
          width: 200,
          align: 'center',
        },
        {
          label: '投标进度',
          prop: 'tenderProgress',
          width: 200,
          align: 'center',
        },
        {
          label: '投标结果',
          prop: 'tenderResult',
          width: 200,
          align: 'center',
        },
        {
          label: '投标情况复盘',
          prop: 'replay',
          width: 200,
          align: 'center',
        },
        {
          label: '中标单位',
          prop: 'winningUnit',
          width: 200,
          align: 'center',
        },
        {
          label: '立项生产单元',
          prop: 'projectUnit',
          width: 200,
          align: 'center',
        },
        {
          label: '中标价格',
          prop: 'tenderDiscount',
          width: 200,
          align: 'center',
        },
        {
          label: '预计合同签订额(万元)',
          prop: 'predictAmount',
          width: 200,
          align: 'center',
        },
        {
          label: '本次招标有效年限',
          prop: 'ageLimit',
          width: 200,
          align: 'center',
        },
        {
          label: '中标服务费缴纳形式',
          prop: 'payType',
          width: 200,
          align: 'center',
        },
        {
          label: '中标服务费缴纳金额(万元)',
          prop: 'payAmount',
          width: 200,
          align: 'center',
        },
        {
          label: '中标服务费缴纳编号',
          prop: 'payId',
          width: 200,
          align: 'center',
        },
        {
          label: '中标服务费是否已核销',
          prop: 'payIsCancel',
          width: 200,
          align: 'center',
        },
        {
          label: '中标服务费报账单核销编号',
          prop: 'paySheetId',
          width: 200,
          align: 'center',
        },
        {
          label: '备注',
          prop: 'remark',
          width: 200,
          align: 'center',
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

      selectTenderInfoByConditions(parames).then((res) => {
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
