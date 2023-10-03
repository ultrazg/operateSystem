<template>
  <div class="paymentAmountDetail">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
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
          :data="tableData"
          :cols="tableCols"
          :hideDefaultIndex="true"
          :selection="false"
          :operator="false"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
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
import { getListByInvoiceActualPayment } from '@/api/financePay/common';
export default {
  name: 'paymentAmountDetail',
  inject: ['common'],
  components: {
    headerTitle,
    searchForm,
    PageTable,
  },
  props: {
    data: {},
  },
  data() {
    return {
      searchVal: {},
      searchItems: [
        {
          type: 'input',
          label: 'ERP编号',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'erpNumber',
          },
        },
        {
          type: 'input',
          label: '分包批次号',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'spBatchId',
          },
        },
        {
          type: 'input',
          label: '子批次号',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'spSubBathId',
          },
        },
        {
          type: 'input',
          label: '报账单号',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'paymentNumber',
          },
        },
        {
          type: 'dataPicker',
          label: '创建时间起',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'paymentSTime',
            format: 'yyyy-MM-dd',
            fieldName: 'endTime',
            placeholder: '请选择创建时间起',
          },
        },
        {
          type: 'dataPicker',
          label: '创建时间止',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'paymentETime',
            format: 'yyyy-MM-dd',
            fieldName: 'endTime',
            placeholder: '请选择创建时间止',
          },
        },
        {
          type: 'select',
          label: '状态',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'status',
            filterable: true,
            options: [
              {
                id: '1',
                name: '已生成',
              },
              {
                id: '2',
                name: '已填单',
              },
              {
                id: '3',
                name: '已确认',
              },
              {
                id: '4',
                name: '已驳回',
              },
            ],
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      tableCols: [
        {
          label: '来源',
          prop: 'sourceFromName',
          width: 180,
          align: 'center',
        },
        {
          label: '付款报账单号',
          prop: 'paymentNumber',
          align: 'center',
          width: 180,
        },
        {
          label: '付款金额',
          prop: 'paymentAmount',
          align: 'center',
          width: 180,
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          align: 'center',
          width: 180,
        },
        {
          label: '分包发票批次号',
          prop: 'spBatchId',
          align: 'center',
          width: 180,
        },
        {
          label: '分包发票子批次号',
          prop: 'spSubBathId',
          align: 'center',
          width: 180,
        },
        {
          label: '状态',
          prop: 'statusName',
          align: 'center',
          width: 180,
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
          width: 180,
        },
        {
          label: '创建人',
          prop: 'createPeople',
          align: 'center',
          width: 180,
        },
        {
          label: '填单时间',
          prop: 'singleTime',
          align: 'center',
          width: 180,
        },
        {
          label: '填单人',
          prop: 'singlePerson',
          align: 'center',
          width: 180,
        },
        {
          label: '确认时间',
          prop: 'updateTime',
          align: 'center',
          width: 180,
        },
        {
          label: '确认人',
          prop: 'updatePeople',
          align: 'center',
          width: 180,
        },
      ],
    };
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
          erpNumber: this.data.row.erpNumber,
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getListByInvoiceActualPayment(parames).then((res) => {
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
  },
};
</script>

<style scoped></style>
