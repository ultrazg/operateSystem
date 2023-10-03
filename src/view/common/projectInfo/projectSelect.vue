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
  name: 'projectSelect',
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
        contractType: undefined,
      },
      title: '',
      searchItems: [
        {
          type: 'input',
          label: '合作合同名称',
          props: {
            fieldName: 'contractName',
            filterable: true,
          },
        },
        {
          type: 'input',
          label: 'ERP编号',
          labelWidth: '100px',
          props: {
            fieldName: 'erpNumber',
            filterable: true,
          },
        },
        {
          type: 'input',
          label: '站点名称',
          labelWidth: '100px',
          hide: true,
          props: {
            fieldName: 'stationName',
            filterable: true,
          },
        },
        {
          type: 'select',
          label: '费用类型',
          labelWidth: '100px',
          hide: true,
          props: {
            fieldName: 'amountType',
            filterable: true,
            options: this.common().projectType,
          },
        },
        {
          type: 'select',
          label: '合同类型',
          labelWidth: '100px',
          hide: true,
          props: {
            fieldName: 'contractType',
            filterable: true,
            options: this.common().projectType,
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
          label: '合作合同名称',
          prop: 'contractName',
        },
        {
          label: '合作合同总金额(含税)',
          prop: 'contractAllAmount',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
        },
        {
          label: '站点名称',
          prop: 'stationName',
          hide: true,
        },
        // {
        //   label: '费用类型',
        //   prop: 'amountType',
        //   hide: true,
        // },
        {
          label: '项目剩余开票金额',
          prop: 'remainingInvoicedAmount',
        },
        {
          label: '站点剩余开票金额',
          hide: true,
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
      this.title = `${this.typeData.name}项目合同选择`;

      if (this.typeData.name === '以租代建') {
        this.searchItems[2].hide = false;
        this.tableCols[3].hide = false;
        this.tableCols[5].hide = true;
        this.tableCols[6].hide = false;
      }
      if (this.typeData.name === '协作') {
      }
      this.onSearch();
    },
    // 搜索
    onSearch(val) {
      this.searchVal = {
        ...val,
        contractType: this.typeData.id,
      };
      this.onCurrentChange(1);
    },
    async onChange(val) {
      if (val.province !== this.searchVal.province) {
        const city = await this.$getCode(val.province);

        // this.$set(this.searchItems[2], 'initValue', val.province);
        this.$set(this.searchItems[3], 'initValue', undefined);
        this.$set(this.searchItems[3].props, 'options', city);
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
