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
      <header-title v-if="false">
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
            :highlightCurrentRow="highlightCurrentRow"
            :selection="!highlightCurrentRow"
            reserveSelection
            :row-key="getRowKey"
            :page-current="page.current"
            :total="page.total"
            :page-size="page.pageSize"
            :selectable="selectable"
            :showPage="false"
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
import { selectOrderInfo } from '@/api/user';
export default {
  name: 'hireNameWorkSelect',
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
    title: {
      type: String,
      default: '承揽合同选择',
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
      searchVal: {},
      searchItems: [],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      selectTable: [], // 选中表格数据
      tableData: [],
      tableCols: [
        // {
        //   label: '承揽订单名称',
        //   prop: 'contractName',
        // },
        // {
        //   label: '承揽订单',
        //   prop: 'orderId ',
        // },
        {
          label: '承揽编码订单',
          prop: 'orderId',
        },
        {
          label: '合同金额',
          prop: 'contractAmount',
        },
        {
          label: '项目名称',
          prop: 'projectName',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
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
          label: '区/县',
          prop: 'area',
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
      const { id } = this.data;
      const parames = {
        data: id,
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      selectOrderInfo(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
          this.$nextTick(() => {
            this.onRowChange(this.rowItems);
          });
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
      if (!this.highlightCurrentRow) {
        return;
      }
      this.selectTable = row;
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    selectable(row, index) {
      if (this.selectTable.length === 0 || Object.keys(this.selectTable).length === 0) {
        return true;
      }
      // console.log('indexindexindex', index, this.selectTable, row);
      const isProvince = this.selectTable[0] && this.selectTable[0].province === row.province;
      const isCity = this.selectTable[0] && this.selectTable[0].city === row.city;
      const isArea =
        this.selectTable[0] &&
        ((row.areaList || []).join(',').indexOf(this.selectTable[0].area) > -1 ||
          row.area.indexOf(this.selectTable[0].area) > -1);

      return isProvince && isCity && isArea;
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
      // console.log(args, '选中');
      this.selectTable = args;
    },
    confirmedit() {
      this.$emit('success', this.selectTable);
      this.closeedit();
    },
    successSubmit() {
      this.$emit('success');
      this.closeedit();
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
