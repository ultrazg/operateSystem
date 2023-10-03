<template>
  <div id="base">
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
        @current-change="onCurrentChange"
        @size-change="onPageSizeChange"
        :showPage="false"
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
</template>

<script>
import moment from 'moment';
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import { viewHisList, exportHis } from '@/api/accountManagement/accountResultTable';

export default {
  name: 'baseInfo',
  components: {
    headerTitle,
    searchForm,
    PageTable,
  },
  props: {
    show: Boolean,
    data: {},
  },
  inject: ['common'],
  data() {
    const { configType } = this.data;

    return {
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),

      searchVal: {
        year: '',
      },
      searchItems: [
        {
          type: 'dataPicker',
          label: '账期',
          initValue: '',
          props: {
            type: 'year',
            format: 'yyyy',
            fieldName: 'year',
            placeholder: '请选择开始时间',
            pickerOptions: {
              disabledDate(time) {
                // return new Date('2020') > time.getTime() || time.getTime() > Date.now();
                return moment(new Date('2022')) > time.getTime() || time.getTime() > moment(new Date());
              },
            },
          },
        },
      ],
      form: {},
      loading: false,
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      tableCols: [
        {
          label: '账期',
          prop: 'month',
          align: 'center',
        },
        {
          label: '业务收入累计(不含税)',
          prop: 'busIncomeTotal',
          width: '100px',
          align: 'center',
        },
        {
          label: '工程结算',
          prop: 'projectSettle',
        },
        {
          label: '收入结转',
          prop: 'incomeBalance',
        },
        {
          label: '合同资产',
          prop: 'contractAssets',
        },
        {
          label: '应收账款借方发生额',
          prop: 'receivableBorrowers',
          width: '100px',
          align: 'center',
        },
        {
          label: '应收账款贷方发生额',
          prop: 'receivableLenders',
          width: '100px',
        },
        {
          label: '应收账款余额',
          prop: 'receivableBalance',
          width: '100px',
        },
        {
          label: '应付账款贷方发生额',
          prop: 'payableLenders',
          width: '100px',
        },
        {
          label: '应付账款借方发生额',
          prop: 'payableBorrowers',
          width: '100px',
        },
        {
          label: '应付账款余额',
          prop: 'payableBalance',
          width: '100px',
        },
        {
          label: '待匹配进项税',
          prop: 'inputTax',
          width: '100px',
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
          label: '预付账款余额',
          prop: 'advanceBalance',
          width: '100px',
        },
        {
          label: '合同负债借方发生额',
          prop: 'contractBorrowers',
          width: '100px',
        },
        {
          label: '合同负债贷方发生额',
          prop: 'contractLenders',
          width: '100px',
        },
        {
          label: '合同负债余额',
          prop: 'contractBalance',
          width: '100px',
        },
        {
          label: '存货',
          prop: 'stock',
        },
        {
          label: '合同履约成本',
          prop: 'contractCost',
          width: '100px',
        },
        {
          label: '其他存货',
          prop: 'otherStock',
        },
      ],
    };
  },
  watch: {
    data(val) {
      this.inputDisabled = val.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
  },
  methods: {
    // 搜索
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    onChange(val) {
      console.log('onChange', val);
      this.searchVal = {
        ...val,
      };
    },
    // 重置
    onReset() {
      console.log('onReset');
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
      const { row } = this.data;
      const parames = {
        data: {
          ...this.searchVal,
          id: row.id,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      debugger;
      viewHisList(parames).then((res) => {
        if (res.code === '200') {
          // const { data, total } = res.data;
          this.tableData = res.data;
          // this.page.total = total;
          this.loading = false;
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        this.form = {
          ...this.form,
          ...row,
        };
      }
    },
    // 导出
    handleExport() {
      this.$confirm('确定导出核算总表详情列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const { row } = this.data;
        const parames = {
          data: {
            ...this.searchVal,
            id: row.id,
          },
          pageNo: this.page.current,
          pageSize: this.page.pageSize,
          sorting: 'id desc',
        };

        exportHis(parames).then((res) => {
          // if (res && res.code === '200') {
          //   this.$notify({
          //     title: '成功',
          //     message: res.data,
          //     type: 'success',
          //     position: 'bottom-right',
          //   });
          // }
          const fileName = '核算总表详情列表信息.xlsx';
          const blob = new Blob([res], {
            type: 'application/vnd.ms-excel;charset=utf-8',
          });

          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            const link = document.createElement('a');

            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(link.href);
          }
        });
      });
    },
    cancelForm() {
      this.form = {};
      this.$emit('cancel');
    },
  },
  created() {
    this.getDataAllList();
  },
};
</script>

<style lang="less" scoped>
#base {
}
</style>
