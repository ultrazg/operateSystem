<template>
  <div class="leftTopTable">
    <div class="leftTopTable_title">
      <span>流水明细</span>
    </div>
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onReset="onReset"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '添加流水',
            click: () => handleAdd(),
          },
        ]"
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
          :selection="true"
          :operator="false"
          :hideDefaultIndex="true"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          :tableHeight="300"
          @selection-change="onSelectionChange"
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
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import { getListByCondition } from '@/api/financeManagement/bankRecordInvoiceManagement';
export default {
  name: 'leftTopTable',
  inject: ['common'],
  data() {
    return {
      searchVal: {
        account: '',
        amount: '',
      },
      searchItems: [
        {
          type: 'input',
          label: '户名',
          initValue: '',
          props: {
            fieldName: 'account',
          },
        },
        {
          type: 'input',
          label: '发生金额',
          initValue: '',
          props: {
            fieldName: 'amount',
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      multipleSelection: [], // 选中表格数据
      tableData: [],
      tableCols: [
        {
          label: '户名',
          prop: 'account',
          align: 'center',
          width: 100,
        },
        {
          label: '发生金额',
          prop: 'amount',
          align: 'center',
          width: 100,
        },
        {
          label: '已勾兑金额',
          prop: 'blendMoney',
          align: 'center',
          width: 100,
        },
        {
          label: '未核销金额',
          prop: 'userAmount',
          align: 'center',
          width: 100,
        },
        {
          label: '对方帐号',
          prop: 'payName',
          align: 'center',
          width: 100,
        },
        {
          label: '交易类型',
          prop: 'payType',
          align: 'center',
          width: 100,
        },
        {
          label: '款项类型',
          prop: 'proceedType',
          align: 'center',
          width: 100,
        },
        {
          label: '交易日期',
          prop: 'recordDate',
          align: 'center',
          width: 100,
        },
        {
          label: '创建时间',
          prop: 'createDate',
          align: 'center',
          width: 100,
        },
      ],
      editshow: false,
      editdata: {},
    };
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
  },
  mounted() {
    this.$nextTick(() => {
      this.onSearch();
    });
  },
  methods: {
    // 重置
    onReset() {
      console.log('onReset');
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
    // 改变请求条数
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
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

      getListByCondition(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    // 保存选中表格数据
    onSelectionChange(args) {
      // console.log(args, "选中");
      this.multipleSelection = args;
    },
    handleAdd() {
      this.$emit('onSelectionChange', this.multipleSelection);
    },
    clearSelection() {
      this.$refs.pageTable.getPageTable();
    },
  },
};
</script>

<style scoped lang="less">
.leftTopTable {
  .leftTopTable_title {
    border-bottom: 1px solid #d3d3d3;
    margin: 0 0 10px 0;
    padding-bottom: 5px;
    color: #ea2134;
    display: flex;
    align-items: center;
    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 14px;
      background: #ea2134;
      margin: 0 3px 0 0;
    }
  }
  #headerTitle {
    /deep/ .searchBox {
      margin-bottom: 0;
      box-shadow: unset;
      border-bottom: none;
    }
  }
  .content-view {
    /deep/ .comp-page-table {
      padding-top: 0;
      border-top: 0;
    }
  }
}
</style>
