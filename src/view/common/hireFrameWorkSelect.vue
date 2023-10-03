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
            :loading="loading"
            :data="tableData"
            :cols="tableCols"
            :highlightCurrentRow="highlightCurrentRow"
            :selection="!highlightCurrentRow"
            reserveSelection
            :row-key="getRowKey"
            :page-current="page.current"
            :total="page.total"
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
import { getHireFrameworkList } from '@/api/user';
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
    highlightCurrentRow: {
      type: Boolean,
      default: true,
    },
  },
  inject: ['common'],
  data() {
    return {
      loading: false,
      scrollHeight: 'auto',
      title: '承揽框架选择',
      searchVal: {},
      searchItems: [
        {
          type: 'input',
          label: '框架名称',
          span: 12,
          initValue: '',
          props: {
            fieldName: 'contractName',
          },
        },
        {
          type: 'input',
          label: '框架编号',
          span: 12,
          initValue: '',
          props: {
            fieldName: 'contractNo',
          },
        },
        {
          type: 'dataPicker',
          label: '签订时间',
          initValue: null,
          props: {
            fieldName: 'signDate',
          },
        },
        {
          type: 'input',
          label: '委托方',
          span: 12,
          initValue: '',
          props: {
            fieldName: 'consignor',
          },
        },
        {
          type: 'select',
          label: '省份',
          initValue: undefined,
          props: {
            fieldName: 'province',
            filterable: true,
            options: this.common().provincialCode,
          },
        },
        {
          type: 'select',
          label: '城市',
          initValue: undefined,
          props: {
            fieldName: 'city',
            filterable: true,
            options: [],
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
          label: '框架名称',
          prop: 'contractName',
        },
        {
          label: '商机编号',
          prop: 'busiId',
        },
        {
          label: '框架编号',
          prop: 'contractId',
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
          label: '框架来源',
          prop: 'from',
        },
        {
          label: '委托方',
          prop: 'consignor',
        },
        {
          label: '主体',
          prop: 'subject',
        },
        {
          label: '签订日期',
          prop: 'signDate',
        },
        {
          label: '档案份数',
          prop: 'documents',
        },
        {
          label: '保证金',
          prop: 'bond',
        },
        {
          label: '安全生产费',
          prop: 'security',
        },
        {
          label: '创建时间',
          prop: 'createDate',
        },
        {
          label: '创建人',
          prop: 'createPeople',
        },
      ],
      rowItems: [],
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
    async onChange(val) {
      if (val.province !== this.searchVal.province) {
        const city = await this.$getCode(val.province);

        // this.$set(this.searchItems[4], 'initValue', val.province);
        this.$set(this.searchItems[5], 'initValue', undefined);
        this.$set(this.searchItems[5].props, 'options', city);
      }
      const { pickerOptions } = this.searchItems[2].props;

      if (val.beginDate && Object.keys(pickerOptions).length === 0) {
        this.searchItems[2].props.pickerOptions = {
          disabledDate(time) {
            return time.getTime() < moment(val.beginDate).valueOf() + 8.64e7; // 后面
          },
        };
      }
      this.searchVal = {
        ...val,
      };
    },
    onRowChange(rowItems, idx = 'id', bool = true) {
      console.log('rowItems', rowItems);
      if (this.$refs.pageTable) {
        this.rowItems = rowItems;
        this.$refs.pageTable.onRowChange(rowItems, idx, bool);
      }
    },
    // 请求某页数据
    onCurrentChange(val) {
      this.page.current = val;
      this.getDataAllList();
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      this.loading = true;
      const parames = {
        data: {
          ...this.searchVal,
          status: 'verify_pass',
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getHireFrameworkList(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
          this.$nextTick(() => {
            this.onRowChange(this.rowItems);
          });
          this.loading = false;
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
      this.rowItems = [];
      this.canceledit();
    },
    canceledit(type) {
      this.$nextTick(() => {
        if (this.highlightCurrentRow) {
          this.$refs.pageTable.clearCurrentRow();
        } else {
          this.$refs.pageTable.getPageTable();
        }
      });
      this.$emit('cancel', type);
    },
    // 保存选中表格数据
    onSelectionChange(args) {
      // console.log(args, "选中");
      this.selectTable = args;
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
