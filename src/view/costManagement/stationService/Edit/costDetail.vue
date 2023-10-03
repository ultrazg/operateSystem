<template>
  <div id="costDetail">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
    />
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
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <!-- :row-key="getRowKey" -->
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
import FormItem from '@/components/formItem';
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import { getServiceCostDetailsList, serviceCostDetails, exportDetails } from '@/api/costManagement/stationService';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
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
      loading: false,
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {},
      searchItems: [
        {
          type: 'dataPicker',
          label: '账期',
          labelWidth: '50px',
          initValue: '',
          props: {
            type: 'month',
            format: 'yyyy-MM',
            fieldName: 'paymentDays',
          },
        },
        {
          type: 'select',
          label: '是否生成暂估应付',
          initValue: '',
          labelWidth: '120px',
          props: {
            fieldName: 'isPrepay',
            filterable: true,
            options: this.common().isJudge,
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
          prop: 'paymentDays',
        },
        {
          label: '年限比例',
          prop: 'yearRatio',
        },
        {
          label: '开始日期',
          prop: 'startTime',
        },
        {
          label: '结束日期',
          prop: 'endTime',
        },
        {
          label: '是否满月',
          prop: 'fullMoon',
        },
        {
          label: '成本金额',
          prop: 'cost',
        },
        {
          label: '是否生成暂估应付',
          prop: 'isPrepay',
        },
        {
          label: '已付款金额',
          prop: 'amountPaid',
        },
        {
          label: '待付款金额',
          prop: 'amountWaitPaid',
        },
      ],
      layout: [
        {
          title: '',
          formItems: [
            {
              label: '总成本金额',
              prop: 'totalAmount',
              inputType: 'inputNumber',
              disabled: true,
              span: 12,
            },
            {
              label: '已付款金额',
              prop: 'amountPaid',
              inputType: 'inputNumber',
              disabled: true,
              span: 12,
            },
            {
              label: '待付款金额',
              prop: 'amountWaitPaid',
              inputType: 'inputNumber',
              disabled: true,
              span: 12,
            },
          ],
        },
      ],
      formRules: {},
    };
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.onSearch();
    // });
  },
  watch: {
    data(val) {
      // this.data = val;
      this.inputDisabled = val.configType === 'cost';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
  },
  methods: {
    // 重置
    onReset() {
      console.log('onReset');
    },
    onChange(val) {
      console.log('onChange');
    },
    reqDetail() {
      this.getDetailsForm(); // 获取上面from的数据
      this.getDataAllList();
    },
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
      this.getDetailsForm(); // 获取上面from的数据
    },
    getDetailsForm() {
      const { row } = this.data;

      if (row && row.id) {
        this.loading = true;
        serviceCostDetails(row.id).then((res) => {
          if (res && res.code === '200' && res.data) {
            this.form = {
              ...this.form,
              ...res.data,
            };
            this.loading = false;
          }
        });
      }
    },
    onCurrentChange(val) {
      this.page.current = val;
      this.getDataAllList();
    },
    // 改变请求条数
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
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

      getServiceCostDetailsList(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
          this.loading = false;
        }
      });
    },
    // 导出
    handleExport() {
      this.$confirm('确定导出发票核销信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = exportDetails;
        const { row } = this.data;

        api(row.id).then((res) => {
          const fileName = '发票核销信息.xlsx';
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
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const param = {
        // ...val,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      editDeviceInfo(param).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right',
          });
          this.$emit('success');
        }
      });
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
  },
  created() {
    if (this.isAdd === false) {
      this.reqDetail();
    }
  },
};
</script>

<style lang="less" scoped>
#base {
}
</style>
