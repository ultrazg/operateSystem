<template>
  <div class="editProjectAmount">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import { addProjectTemp, updateProjectTemp } from '@/api/common';
export default {
  name: 'editProjectAmount',
  inject: ['common'],
  components: {
    FormItem,
  },
  props: {
    show: Boolean,
    data: {},
    info: {
      type: Object,
      default: () => ({}),
    },
    spanLength: {
      type: Number,
      default: 12,
    },
  },
  data() {
    const { configType } = this.data;

    return {
      /** 输入禁用 */
      inputDisabled: configType === 'edit',
      isEdit: configType === 'edit',
      isAdd: configType === 'add',
      form: {},
      layout: [
        {
          title: '基础信息',
          formItems: [
            {
              label: '新增已开总包发票',
              prop: 'zbinvoiceTotalAmount',
              inputType: 'input',
              span: this.spanLength,
            },
            {
              label: '新增已回款',
              prop: 'projectCumulativeAmount',
              inputType: 'input',
              span: this.spanLength,
            },
          ],
        },
      ],
      formRules: {
        zbinvoiceTotalAmount: {
          required: true,
          message: '请输入已开总包发票',
          trigger: 'blur',
        },
        projectCumulativeAmount: {
          required: true,
          message: '请输入已回款',
          trigger: 'blur',
        },
      },
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        this.form = {
          ...this.form,
          projectCumulativeAmount: row.projectCumulativeAmount,
          zbinvoiceTotalAmount: row.zbinvoiceTotalAmount,
        };
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      if (parseFloat(val.projectCumulativeAmount) > parseFloat(val.zbinvoiceTotalAmount)) {
        this.$notify({
          title: '失败',
          message: '已回款金额不能大于已开总包发票金额',
          type: 'error',
          position: 'bottom-right',
        });

        return;
      }
      const { row } = this.data;
      const id = this.isAdd ? '' : row.id;
      const params = {
        ...val,
        id,
        erpNumber: row.erpNumber,
        projectId: row.projectID,
      };
      const api = this.isAdd ? addProjectTemp : updateProjectTemp;
      const message = this.isAdd ? '新增成功' : '修改成功';

      api(params).then((res) => {
        if (res && res.code === '200') {
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
    if (!this.isAdd) {
      this.reqDetail();
    }
  },
};
</script>

<style scoped></style>
