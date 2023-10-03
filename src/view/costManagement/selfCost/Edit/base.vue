<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :idEdit="isEdit"
      :form.sync="form"
      :labelWidth="'140px'"
    />
    <wrapper :key="'uploadTender'" :title="'成本记录信息'" :isFold="false">
      <page-table ref="pageTable" col-align="left" :showPage="false" :data="selfCostInfoData" :cols="selfCostInfoCols">
      </page-table>
    </wrapper>
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import PageTable from '@/components/page-table';
import { detailSelfCost } from '@/api/costManagement/selfCost';
import Wrapper from '@/components/wrapper';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    PageTable,
    Wrapper,
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
      isDetail: ['detail'].includes(configType),
      form: {},
      layout: [
        {
          title: '成本信息',
          formItems: [
            {
              label: 'ERP编号',
              prop: 'erpNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目名称',
              prop: 'name',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目成本预算',
              prop: 'cost',
              inputType: 'input',
              span: 12,
            },
            {
              label: '已报销金额',
              prop: 'totalExpenses',
              inputType: 'input',
              span: 12,
            },
            {
              label: '剩余报销金额',
              prop: 'totalWaitExpenses',
              inputType: 'input',
              span: 12,
            },
            {
              label: '已付款总金额',
              prop: 'totalPaid',
              inputType: 'input',
              span: 12,
            },
            {
              label: '待付款总金额',
              prop: 'totalWaitPaid',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      selfCostInfoData: [],
      selfCostInfoCols: [
        {
          label: '成本类型',
          prop: 'costType',
        },
        {
          label: '报销金额',
          prop: 'amountExpenses',
        },
        {
          label: '报销人',
          prop: 'expensesUser',
        },
        {
          label: '报销时间',
          prop: 'expensesTime',
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
      formRules: {},
    };
  },
  watch: {
    data(val) {
      // this.data = val;
      this.inputDisabled = val.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      this.isDetail = ['detail'].includes(val.configType);
      if (this.isDetail) {
        this.reqDetail();
      }
    },
  },
  methods: {
    reqDetail() {
      console.log('reqDetail');
      const { row } = this.data;

      if (row && row.id) {
        detailSelfCost(row.id).then((res) => {
          if (res && res.code === '200' && res.data) {
            this.form = {
              ...this.form,
              ...res.data,
            };
            this.selfCostInfoData = res.data.costInfoList;
          }
          console.log(this.selfCostInfoData);
        });
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const param = {};
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
  /deep/.comp-page-table {
    min-height: auto;
  }
}
</style>
