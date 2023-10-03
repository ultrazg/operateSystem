<template>
  <div class="rightTopTable">
    <div class="rightTopTable_title">
      <span>开票明细</span>
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
            label: '添加开票明细',
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
import { invoiceDetailList } from '@/api/financeManagement/bankRecordInvoiceManagement';
export default {
  name: 'rightTopTable',
  inject: ['common'],
  data() {
    return {
      searchVal: {
        erpNumber: '',
        amount: '',
      },
      searchItems: [
        {
          type: 'input',
          label: 'ERP编号',
          initValue: '',
          props: {
            fieldName: 'erpNumber',
          },
        },
        {
          type: 'input',
          label: '开票金额',
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
          label: 'erp编号',
          prop: 'erpNumber',
          align: 'center',
          width: 120,
        },
        {
          label: '开票总额',
          prop: 'applyInvoiceDtoAmount',
          align: 'center',
          width: 120,
        },
        {
          label: '发票金额',
          prop: 'amount',
          align: 'center',
          width: 120,
        },
        {
          label: '已勾兑金额',
          prop: 'blendMoney',
          align: 'center',
          width: 120,
        },
        {
          label: '不含税',
          prop: 'amountNTax',
          align: 'center',
          width: 120,
        },
        {
          label: '税金',
          prop: 'amountTax',
          align: 'center',
          width: 120,
        },
        {
          label: '一级专业',
          prop: 'applyInvoiceDtoOneMajor',
          align: 'center',
          width: 120,
        },
        {
          label: '财务核销时间',
          prop: 'applyInvoiceDtoConfirmDate',
          align: 'center',
          width: 120,
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

      invoiceDetailList(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data.map((ele) => {
            ele.applyInvoiceDtoAmount = ele.applyInvoiceDto.amount ? ele.applyInvoiceDto.amount : '';
            ele.applyInvoiceDtoOneMajor = ele.applyInvoiceDto.oneMajor ? ele.applyInvoiceDto.oneMajor : '';
            ele.applyInvoiceDtoConfirmDate = ele.applyInvoiceDto.confirmDate ? ele.applyInvoiceDto.confirmDate : '';

            return ele;
          });
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
.rightTopTable {
  .rightTopTable_title {
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
