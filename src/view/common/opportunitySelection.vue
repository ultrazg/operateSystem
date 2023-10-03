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
import { selectBusinessOpportunityByConditions } from '@/api/marketMiddleStage/tenderInfoList';
export default {
  name: 'OpportunitySelection',
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
  inject: ['common'],
  data() {
    return {
      scrollHeight: 'auto',
      title: '商机选择',
      searchVal: {
        startTime: '',
        endTime: '',
        busiResource: '',
        busiId: '',
        tenderDate: '',
        tenderState: '',
        busiName: '',
        tenderWin: '',
      },
      searchItems: [
        {
          type: 'dataPicker',
          label: '获取时间起',
          span: 12,
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'startTime',
            type: 'date',
            format: 'yyyy-MM-dd',
            placeholder: '请选择获取时间起',
          },
        },
        {
          type: 'dataPicker',
          label: '获取时间止',
          span: 12,
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'endTime',
            type: 'date',
            format: 'yyyy-MM-dd',
            placeholder: '请选择获取时间止',
          },
        },
        {
          type: 'select',
          label: '商机来源',
          span: 12,
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'busiResource',
            filterable: true,
            options: this.common().busiResourceCode,
          },
        },
        {
          type: 'input',
          label: '商机编号',
          span: 12,
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'busiId',
            filterable: true,
          },
        },
        {
          type: 'dataPicker',
          label: '投标时间',
          span: 12,
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'tenderDate',
            type: 'date',
            format: 'yyyy-MM-dd',
            placeholder: '请选择获取时间起',
          },
        },
        {
          type: 'select',
          label: '投标状态',
          span: 12,
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'tenderState',
            filterable: true,
            options: this.common().tenderStateInfo,
          },
        },
        {
          type: 'input',
          label: '商机(项目)名称',
          span: 12,
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'busiName',
            filterable: true,
          },
        },
        {
          type: 'select',
          label: '是否中标',
          span: 12,
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'tenderWin',
            filterable: true,
            options: this.common().tenderWin,
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
          label: '商机(项目)名称',
          prop: 'busiName',
          width: 100,
          align: 'center',
        },
        {
          label: '商机编号',
          prop: 'busiId',
          width: 100,
          align: 'center',
        },
        {
          label: '商机来源',
          prop: 'busiResource',
          width: 100,
          align: 'center',
        },
        {
          label: '商机获取日期',
          prop: 'busiDate',
          width: 100,
          align: 'center',
        },
        {
          label: '客户名称',
          prop: 'custName',
          width: 100,
          align: 'center',
        },
        {
          label: '项目实施地区',
          prop: 'implementArea',
          width: 100,
          align: 'center',
        },
        {
          label: '一级专业',
          prop: 'oneMajor',
          width: 100,
          align: 'center',
        },
        {
          label: '二级专业',
          prop: 'twoMajor',
          width: 100,
          align: 'center',
        },
        {
          label: '采购形式',
          prop: 'purchaseModality',
          width: 100,
          align: 'center',
        },
        {
          label: '市场类型',
          prop: 'marketType',
          width: 100,
          align: 'center',
        },
        {
          label: '投标时间',
          prop: 'tenderDate',
          width: 100,
          align: 'center',
        },
        {
          label: '项目规模(万元)',
          prop: 'projectScale',
          width: 100,
          align: 'center',
        },
        {
          label: '拟投规模(万元)',
          prop: 'planScale',
          width: 100,
          align: 'center',
        },
        {
          label: '商机类别',
          prop: 'opportunityCategory',
          width: 100,
          align: 'center',
        },
        {
          label: '预估毛利润率',
          prop: 'grossProfitRateString',
          width: 100,
          align: 'center',
        },
        {
          label: '拓展类型',
          prop: 'expandType',
          width: 100,
          align: 'center',
        },
        {
          label: '所属生产中心',
          prop: 'productionCenter',
          width: 100,
          align: 'center',
        },
        {
          label: '项目经理',
          prop: 'projectManager',
          width: 100,
          align: 'center',
        },
        {
          label: '投标状态',
          prop: 'tenderState',
          width: 100,
          align: 'center',
        },
        {
          label: '是否中标',
          prop: 'tenderWin',
          width: 100,
          align: 'center',
        },
        {
          label: '中标份额(万元)',
          prop: 'tenderShare',
          width: 150,
          align: 'center',
        },
        {
          label: '预计合同额(万元)',
          prop: 'expertContract',
          width: 150,
          align: 'center',
        },
        {
          label: '复盘',
          prop: 'replay',
          width: 100,
          align: 'center',
        },
        {
          label: '备注',
          prop: 'remark',
          width: 100,
          align: 'center',
        },
        {
          label: '审核状态',
          prop: 'statusName',
          width: 100,
          align: 'center',
        },
        {
          label: '处理结果',
          prop: 'auditResult',
          width: 100,
          align: 'center',
        },
        {
          label: '处理意见',
          prop: 'auditOpinion',
          width: 100,
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
          busiName: this.searchVal.busiName,
          busiId: this.searchVal.busiId,
          busiResource: this.searchVal.busiResource,
          startTime: this.searchVal.startTime,
          endTime: this.searchVal.endTime,
          custName: this.searchVal.custName,
          tenderDate: this.searchVal.tenderDate,
          tenderWin: this.searchVal.tenderWin,
          tenderState: this.searchVal.tenderState,
          status: 'verify_pass',
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      selectBusinessOpportunityByConditions(parames).then((res) => {
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
