<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
    <wrapper :title="`${qualificationType === '0' ? '公司' : '人员'}申请资质`">
      <page-table
        v-if="qualificationType === '0'"
        ref="pageTable"
        col-align="left"
        :data="companyTableData"
        :cols="companyTableCols"
        :selection="false"
        :operator="false"
        reserveSelection
        hideDefaultIndex
      >
      </page-table>
      <page-table
        v-if="qualificationType === '1'"
        ref="pageTable"
        col-align="left"
        :data="tableData"
        :cols="tableCols"
        :selection="false"
        :operator="false"
        reserveSelection
        hideDefaultIndex
      >
      </page-table>
    </wrapper>
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import { dealWithrecord } from '@/api/qualificationManagement/qualificationInfo';
export default {
  name: 'dealWidthInfo',
  components: {
    FormItem,
    wrapper,
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
      form: {},
      layout: [
        {
          title: '申请详情',
          formItems: [
            {
              label: '用途',
              prop: 'use',
              inputType: 'select',
              span: 12,
              options: this.common().useType,
            },
            {
              label: '申请说明',
              prop: 'explanation',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        use: {
          required: true,
          message: '请选择用途',
          trigger: 'blur',
        },
        explanation: {
          required: true,
          message: '请输入申请说明',
          trigger: 'blur',
        },
      },
      qualificationType: '公司',

      companyTableData: [],
      companyTableCols: [
        {
          label: '下载人',
          prop: 'downloadPeople',
        },
        {
          label: '下载时间',
          prop: 'downloadTime',
        },
        {
          label: '申请资质类型',
          prop: 'qualificationType',
        },
        {
          label: '申请资质名称',
          prop: 'name',
        },
        {
          label: '资质等级',
          prop: 'level',
        },
      ],
      tableData: [],
      tableCols: [
        {
          label: '下载人',
          prop: 'downloadPeople',
        },
        {
          label: '下载时间',
          prop: 'downloadTime',
        },
        {
          label: '申请资质类型',
          prop: 'qualificationType',
        },
        {
          label: '姓名',
          prop: 'personName',
        },
        {
          label: '申请资质名称',
          prop: 'name',
        },
        {
          label: '资质等级',
          prop: 'level',
        },
      ],
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  watch: {
    data(val) {
      console.log('val', val);
      // this.data = val;
      this.inputDisabled = val.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        dealWithrecord(row.id).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              use: res.data.use,
              explanation: res.data.explanation,
            };
            const qualificationType =
              res.data.qualificationDealWithItemInfos && res.data.qualificationDealWithItemInfos[0].qualificationType;

            const qualificationItem = this.common().qualificationType.filter(
              (qualification) => qualification.name === qualificationType || qualification.id === qualificationType,
            );

            this.qualificationType = qualificationItem && qualificationItem[0] && qualificationItem[0].id;
            if (this.qualificationType === '0') {
              this.companyTableData = res.data.qualificationDealWithItemInfos;
            } else {
              this.tableData = res.data.qualificationDealWithItemInfos;
            }
          }
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
      const param = {
        ...val,
        idList: this.tableData,
        type: 0,
      };
      const message = '申请成功';

      // applycompany(param).then((res) => {
      //   if (res.code === '200') {
      //     this.$notify({
      //       title: '成功',
      //       message,
      //       type: 'success',
      //       position: 'bottom-right',
      //     });
      //     this.$emit('success');
      //   }
      // });
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
  #PageTable {
    min-height: auto;
  }
}
</style>
