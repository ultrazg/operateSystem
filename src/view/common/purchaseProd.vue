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
import { getPurchaseListByConditions } from '@/api/user';
export default {
  name: 'purchaseProd',
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
      title: '采购项目选择',
      searchVal: {
        unitName: undefined,
        contractNo: undefined,
        province: undefined,
        city: undefined,
      },
      searchItems: [
        {
          type: 'select',
          label: '所属生产中心',
          labelWidth: '110px',
          props: {
            fieldName: 'productionCenter',
            filterable: true,
            options: this.common().provincialCode,
          },
        },
        {
          type: 'input',
          label: '甲方项目编号',
          labelWidth: '100px',
          props: {
            fieldName: 'prodId',
          },
        },
        {
          type: 'input',
          label: '采购项目编号',
          labelWidth: '100px',
          props: {
            fieldName: 'purchaseProdId',
          },
        },
        {
          type: 'select',
          label: '是否联合拓展',
          labelWidth: '100px',
          initValue: undefined,
          props: {
            fieldName: 'isUnion',
            filterable: true,
            options: this.common().bondIsCancel,
          },
        },
        {
          type: 'input',
          label: '年度',
          initValue: undefined,
          props: {
            fieldName: 'year',
          },
        },
        {
          type: 'input',
          label: '方案编号',
          initValue: undefined,
          props: {
            fieldName: 'planId',
          },
        },
        {
          type: 'input',
          label: '中标人',
          initValue: undefined,
          props: {
            fieldName: 'winner',
          },
        },
        {
          type: 'input',
          label: 'WWW2合同',
          labelWidth: '100px',
          initValue: undefined,
          props: {
            fieldName: 'WWWId',
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
          label: '采购项目编号',
          prop: 'purchaseProdId',
        },
        {
          label: '甲方项目编号',
          prop: 'prodId',
        },
        {
          label: '所属生产中心',
          prop: 'productionCenter',
        },
        {
          label: '年度',
          prop: 'year',
        },
        {
          label: '采购项目名称',
          prop: 'prodName',
        },
        {
          label: '项目归属',
          prop: 'projectBelong',
        },
        {
          label: '合作框架编号',
          prop: 'contractNo',
        },
        {
          label: '开始时间',
          prop: 'sTime',
        },
        {
          label: '结束时间',
          prop: 'eTime',
        },
        {
          label: '创建时间',
          prop: 'createTime',
        },
        {
          label: '项目归属',
          prop: 'projectBelong',
        },
        {
          label: '省份',
          prop: 'province',
        },
        {
          label: '城市',
          prop: 'city',
        },
        {
          label: '一级专业',
          prop: 'oneMajor',
        },
        {
          label: '二级专业',
          prop: 'twoMajor',
        },
        {
          label: '项目工期',
          prop: 'prodDate',
        },
        {
          label: '项目预估收入(不含税,万元)',
          prop: 'prodIncome',
        },
        {
          label: '税率',
          prop: 'taxRate',
        },
        {
          label: '是否联合拓展',
          prop: 'isUnion',
        },
        {
          label: '合作方名称',
          prop: 'partnerName',
        },
        {
          label: '注册资金(人民币,万元)',
          prop: 'registerCapital',
        },
        {
          label: '是否具有甲方项目要求的资质',
          prop: 'qualification',
        },
        {
          label: '采购委托',
          prop: 'purchaseEntrust',
        },
        {
          label: '公告/邀请函',
          prop: 'announcement',
        },
        {
          label: '评审报告',
          prop: 'reviewReport',
        },
        {
          label: '中标通知书',
          prop: 'biddingLetter',
        },
        {
          label: '拦标价(不含税,万元)',
          prop: 'stopBiddingPrice',
        },
        {
          label: '预购采购金额(不含税,万元)',
          prop: 'purchaseAmountNotRate',
        },
        {
          label: '预估增值税金额(万元)',
          prop: 'addedValueTax',
        },
        {
          label: '预购采购金额(万元)',
          prop: 'purchaseAmount',
        },
        {
          label: '计划份额',
          prop: 'planLot',
        },
        {
          label: '合同期限',
          prop: 'contractDeadline',
        },
        {
          label: '方案编号',
          prop: 'planId',
        },
        {
          label: '采购代理机构名称',
          prop: 'agencyName',
        },
        {
          label: '采购方式',
          prop: 'purchaseType',
        },
        {
          label: '价格/商务/技术分值',
          prop: 'PBTScore',
        },
        {
          label: '(商务技术分)客观分值占比',
          prop: 'BScoreProportion',
        },
        {
          label: '是否需公司总办会审议',
          prop: 'isNeedReview',
        },
        {
          label: '采购方案其他',
          prop: 'planOthers',
        },
        {
          label: '备注',
          prop: 'remark',
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
    onChange(val) {
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

      getPurchaseListByConditions(parames).then((res) => {
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
