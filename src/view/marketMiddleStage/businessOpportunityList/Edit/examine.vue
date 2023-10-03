<template>
  <div id="base">
    <!-- 提交审核 -->
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
    <nextAuditPeople :show="peopleShow" :data="peopleData" @cancel="closeEdit" @success="successEdit" />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import nextAuditPeople from '@/view/common/nextAuditPeople';
import { startProcess } from '@/api/marketMiddleStage/businessOpportunityList';
export default {
  name: 'examineInfo',
  components: {
    FormItem,
    nextAuditPeople,
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
      isEdit: true,
      form: {
        auditOpinion: '',
        nextAuditPeopleName: '',
      },
      layout: [
        {
          title: '审核信息',
          formItems: [
            {
              label: '申请说明',
              prop: 'auditOpinion',
              inputType: 'input',
              span: 12,
            },
            {
              label: '指定审核人',
              prop: 'nextAuditPeopleName',
              inputType: 'select',
              span: 12,
              onFocus: (val) => {
                this.peopleData = {
                  ...this.data,
                  ...this.form,
                  reqData: {
                    roleCode: 'ROLE7AyaT0wH2',
                  },
                };
                this.peopleShow = true;
                console.log('onFocus', val);
              },
            },
          ],
        },
      ],
      formRules: {
        auditOpinion: {
          required: true,
          message: '请输入申请说明',
          trigger: 'blur',
        },
        nextAuditPeopleName: {
          required: true,
          message: '请选择指定审核人',
          trigger: 'change',
        },
      },
      peopleShow: false,
      peopleData: {},
      selectTable: {},
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  methods: {
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    // 提交表单
    submitForm(val) {
      console.log('this.data', this.data);
      const params = {
        auditOpinion: val.auditOpinion,
        nextAuditPeople: this.selectTable.username,
        businessCode: 't_business_opportunity',
        businessId: this.data.row.id, // 业务id
        currStatus: this.data.row.status, // 当前状态(业务)
        dealwithId: '',
        judgeResult: '4', // 提交审核
      };

      startProcess(params).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '提交审核成功',
            type: 'success',
            position: 'bottom-right',
          });
          this.$emit('success');
        }
      });
    },

    // 取消提交
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
    // 关闭预览
    closeEdit() {
      this.peopleShow = false;
      this.peopleData = {};
    },
    // 成功获取数据
    successEdit(selectTable) {
      console.log('selectTable', selectTable);
      this.selectTable = selectTable;
      this.form = {
        ...this.form,
        nextAuditPeople: selectTable.username,
        nextAuditPeopleName: selectTable.realName,
      };
      // this.form.nextAuditPeopleName = selectTable.realName;
      this.closeEdit();
    },
  },
};
</script>

<style scoped></style>
