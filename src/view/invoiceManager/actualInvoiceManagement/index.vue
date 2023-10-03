<template>
  <div class="detail-table">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
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
          :selection="false"
          :operator="false"
          :hideDefaultIndex="true"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
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
// import Flex from '@/components/flex';
import { getActualInvoiceListByCondition } from '@/api/invoiceManager/index';
export default {
  name: 'actualInvoiceManagement',
  inject: ['common'],
  props: {
    data: {},
  },
  data() {
    return {
      loading: false,
      searchVal: {
        unitName: '',
        year: '',
      },
      searchItems: [
        {
          type: 'input',
          label: '发票id',
          initValue: '',
          props: {
            fieldName: 'billId',
          },
        },
        {
          type: 'input',
          label: '发票种类',
          initValue: '',
          props: {
            fieldName: 'invoiceType',
          },
        },
        {
          type: 'input',
          label: '发票号码',
          initValue: '',
          props: {
            fieldName: 'invoiceNumber',
          },
        },
        {
          type: 'input',
          label: '客户名称',
          initValue: '',
          props: {
            fieldName: 'customerName',
          },
        },
        {
          type: 'input',
          label: '客户名称',
          initValue: '',
          props: {
            fieldName: 'erpNumber',
          },
        },
        {
          type: 'input',
          label: 'ERP编号',
          initValue: '',
          props: {
            fieldName: 'customerName',
          },
        },
        {
          type: 'dataPicker',
          label: '开票时间起',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'beginDate',
            placeholder: '请选择开票时间起日期',
          },
        },
        {
          type: 'dataPicker',
          label: '开票时间止',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'endDate',
            placeholder: '请选择开票时间止日期',
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
          label: '发票id',
          prop: 'billId',
          align: 'center',
          width: 150,
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          align: 'center',
          width: 150,
        },
        {
          label: '发票种类',
          prop: 'invoiceType',
          align: 'center',
          width: 160,
        },
        {
          label: '发票号码',
          prop: 'invoiceNumber',
          align: 'center',
          width: 160,
        },
        {
          label: '类别代码',
          prop: 'classCode',
          align: 'center',
          width: 100,
        },
        {
          label: '客户名称',
          prop: 'customerName',
          align: 'center',
          width: 100,
        },
        {
          label: '开票日期',
          prop: 'invoiceDate',
          align: 'center',
          width: 100,
        },
        {
          label: '合计金额',
          prop: 'totalAmount',
          align: 'center',
          width: 100,
        },
        {
          label: '合计税额',
          prop: 'totalTaxAmount',
          align: 'center',
          width: 160,
        },
        {
          label: '价税合计',
          prop: 'totalAdValoremAmount',
          align: 'center',
          width: 160,
        },
        {
          label: '商品名称',
          prop: 'tradeName',
          align: 'center',
          width: 160,
        },
        {
          label: '型号',
          prop: 'modelNumber',
          align: 'center',
          width: 100,
        },
        {
          label: '计量单位',
          prop: 'unit',
          align: 'center',
          width: 100,
        },
        {
          label: '数量',
          prop: 'count',
          align: 'center',
          width: 100,
        },
        {
          label: '税率',
          prop: 'taxRate',
          align: 'center',
          width: 100,
        },
        {
          label: '备注',
          prop: 'remark',
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
    console.log(this.data);
    this.$nextTick(() => {
      this.onSearch();
    });
  },
  methods: {
    // 重置
    onReset() {
      console.log('onReset');
    },
    onChange(val) {
      console.log('onChange');
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
      this.loading = true;
      const parames = {
        data: {
          ...this.searchVal,
          // cooperationUnitName: this.searchVal.unitName,
          // year: this.searchVal.year,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getActualInvoiceListByCondition(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
          this.loading = false;
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
    // 预览
    openDialog(state, info = {}) {
      this.editshow = true;
      this.editdata = info;
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },
    successEdit() {
      this.editshow = false;
      this.getDataAllList();
    },
  },
};
</script>

<style scoped lang="less"></style>
