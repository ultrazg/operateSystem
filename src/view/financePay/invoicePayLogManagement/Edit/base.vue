<template>
  <div class="invoicePayLogManagementDetailTable">
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
          :treeProps="{ children: 'children', hasChildren: 'hasChildren' }"
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
import { getPayLogListByCondition } from '@/api/financePay/invoicePayLogManagement';
export default {
  name: 'invoicePayLogManagementDetailTable',
  inject: ['common'],
  props: {
    data: {},
    isErpNumberSearch: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
  },
  data() {
    return {
      searchVal: {
        status: undefined,
        erpNumber: undefined,
      },
      searchItems: [
        {
          type: 'select',
          label: '状态',
          initValue: '',
          props: {
            fieldName: 'status',
            filterable: true,
            options: [
              {
                id: '1',
                name: '付款中',
              },
              {
                id: '2',
                name: '付款完结',
              },
            ],
          },
        },
        {
          type: 'input',
          label: 'ERP编号',
          initValue: '',
          props: {
            fieldName: 'erpNumber',
          },
          hide: this.isErpNumberSearch,
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
          label: 'ERP编号',
          prop: 'erpNumber',
          align: 'center',
        },
        {
          label: '暂估应付编码',
          prop: 'payLogCode',
          align: 'center',
        },
        {
          label: '拆分金额',
          prop: 'splitAmount',
          align: 'center',
        },
        {
          label: '分包发票批次号',
          prop: 'spBatchId',
          align: 'center',
        },
        {
          label: '分包发票子批次号',
          prop: 'spSubBathId',
          align: 'center',
        },
        {
          label: '状态',
          prop: 'status',
          align: 'center',
        },
      ],
      editshow: false,
      editdata: {},
      editTitle: '',
      editWidth: '900px',
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
      console.log(this.data);
      const parames = {
        data: {
          payLogCode: this.isErpNumberSearch ? '' : this.data.row.code,
          erpNumber: this.isErpNumberSearch ? this.data.row.erpNumber : '',
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'create_time desc',
      };

      getPayLogListByCondition(parames).then((res) => {
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

<style scoped lang="less"></style>
