/* eslint-disable camelcase */
<template>
  <div id="accountPeriod">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '导出',
            click: () => handleExport(),
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
          :loading="loading"
          :data="tableData"
          :cols="tableCols"
          :selection="false"
          :operator="false"
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

    <edit :show="editshow" :data="editdata" @cancel="closeEdit" @success="successEdit"></edit>
  </div>
</template>

<script>
import moment from 'moment';
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Edit from './Edit';
import { listByCondition, exportList } from '@/api/accountManagement/accountResultTable';
export default {
  name: 'trialBalanceStatement',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        month: '',
        projectCode: '',
        projectName: '',
      },
      searchItems: [
        {
          type: 'dataPicker',
          label: '账期',
          initValue: moment(new Date()).format('yyyyMM'),
          props: {
            type: 'month',
            format: 'yyyyMM',
            fieldName: 'month',
            placeholder: '请选择开始时间',
          },
        },
        {
          type: 'input',
          label: '项目编码',
          initValue: '',
          props: {
            fieldName: 'projectCode',
            filterable: true,
          },
        },
        {
          type: 'input',
          label: '项目名称',
          initValue: '',
          props: {
            fieldName: 'projectName',
            filterable: true,
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
          label: '账期',
          prop: 'month',
        },
        {
          label: '项目编码',
          prop: 'projectCode',
        },
        {
          label: '项目名称',
          prop: 'projectName',
        },
        {
          label: '业务收入累计(不含税)',
          prop: 'busIncomeTotalHappen',
          width: '100px',
        },
        {
          label: '项目成本累计(不含税)',
          prop: 'a',
          width: '100px',
        },
        {
          label: '项目合作成本(不含税)',
          prop: 'b',
          width: '100px',
        },
        {
          label: '毛利率',
          prop: 'c',
          width: '80px',
        },
        {
          label: '工程结算',
          prop: 'projectSettleHappen',
        },
        {
          label: '收入结转',
          prop: 'incomeBalanceHappen',
        },
        {
          label: '合同资产',
          prop: 'contractAssetsHappen',
        },
        {
          label: '应收账款借方发生额',
          prop: 'receivableBorrowers',
          width: '100px',
        },
        {
          label: '应收账款贷方发生额',
          prop: 'receivableLenders',
          width: '100px',
        },
        {
          label: '应收账款发生额',
          prop: 'receivableHappen',
        },
        {
          label: '应付账款贷方发生额',
          prop: 'payableBorrowers',
          width: '100px',
        },
        {
          label: '应付账款借方发生额',
          prop: 'payableLenders',
          width: '100px',
        },
        {
          label: '应付账款发生额',
          prop: 'payableHappen',
        },
        {
          label: '待匹配进项税',
          prop: 'inputTaxHappen',
        },
        {
          label: '预付账款借方发生额',
          prop: 'advanceBorrowers',
          width: '100px',
        },
        {
          label: '预付账款贷方发生额',
          prop: 'advanceLenders',
          width: '100px',
        },
        {
          label: '预付账款发生额',
          prop: 'advanceHappen',
        },
        {
          label: '合同负债贷方发生额',
          prop: 'contractBorrowers',
          width: '100px',
        },
        {
          label: '合同负债借方发生额',
          prop: 'contractLenders',
          width: '100px',
        },
        {
          label: '合同负债发生额',
          prop: 'contractHappen',
        },
        {
          label: '存货',
          prop: 'stockHappen',
        },
        {
          label: '合同履约成本',
          prop: 'contractCostHappen',
        },
        {
          label: '其他存货',
          prop: 'otherStockHappen',
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
    Edit,
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
      this.$refs.searchForm.addInitValue();
    },
    onChange(val) {
      console.log('onChange', val);
      this.searchVal = {
        ...val,
      };
    },
    // 搜索
    onSearch(val) {
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
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      listByCondition(parames, null).then((res) => {
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
    // 导出
    handleExport() {
      this.$confirm('确定导出核算账期表列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const parames = {
          data: {
            ...this.searchVal,
          },
          pageNo: this.page.current,
          pageSize: this.page.pageSize,
          sorting: 'id desc',
        };

        exportList(parames, null).then((res) => {
          if (res && res.code === '200') {
            this.$notify({
              title: '成功',
              message: res.data,
              type: 'success',
              position: 'bottom-right',
            });
          }
          // const fileName = '试算总表列表信息.xlsx';
          // const blob = new Blob([res], {
          //   type: 'application/vnd.ms-excel;charset=utf-8',
          // });

          // if (navigator.msSaveBlob) {
          //   navigator.msSaveBlob(blob, fileName);
          // } else {
          //   const link = document.createElement('a');

          //   link.href = URL.createObjectURL(blob);
          //   link.download = fileName;
          //   link.click();
          //   URL.revokeObjectURL(link.href);
          // }
        });
      });
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },
    successEdit() {
      this.closeEdit();
      this.onCurrentChange(1);
    },
  },
};
</script>

<style lang="less" scoped>
#accountPeriod {
}
</style>
