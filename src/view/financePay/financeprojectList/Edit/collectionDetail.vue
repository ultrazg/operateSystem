/* eslint-disable camelcase */
<template>
  <div id="collectionDetail">
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
          :data="tableData"
          :cols="tableCols"
          :selection="false"
          :operator="false"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          :hideDefaultIndex="true"
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
import { getListByCommand } from '@/api/financeManagement/invoiceVerificateManagement';
export default {
  name: 'collectionDetail',
  inject: ['common'],
  props: {
    data: {},
  },
  data() {
    return {
      searchVal: {
        paymentTime: '',
        erpNumber: '',
      },
      searchItems: [
        {
          type: 'dataPicker',
          label: '回款时间',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'paymentTime',
            placeholder: '请选择回款时间',
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
          label: 'ERP编号',
          prop: 'erpNumber',
          align: 'center',
        },
        {
          label: '项目名称',
          prop: 'projectName',
          align: 'center',
        },
        {
          label: '勾兑金额',
          prop: 'paymentAmount',
          align: 'center',
        },
        {
          label: '勾兑人',
          prop: 'paymentPeople',
          align: 'center',
        },
        {
          label: '勾兑时间',
          prop: 'paymentTime',
          align: 'center',
        },
        {
          label: '核销时间',
          prop: 'verificateTime',
          align: 'center',
        },
      ],
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
      const parames = {
        data: {
          ...this.searchVal,
          erpNumber: this.data.row.erpNumber,
          selectSource: 'XMCWTJ-SKJECK', // 选择来源，用于过滤  XMCWTJ-SKJECK:项目财务统计-收款金额查看
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getListByCommand(parames).then((res) => {
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

<style lang="less" scoped></style>
