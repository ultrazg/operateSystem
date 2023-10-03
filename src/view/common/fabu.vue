<template>
  <div id="fabuInfo">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
    <nextAuditPeople
      ref="nextAuditPeople"
      :show="peopleShow"
      :data="peopleData"
      @cancel="closeEdit"
      @success="successEdit"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import nextAuditPeople from '@/view/common/nextAuditPeople.vue';
import { startProcess } from '@/api/marketMiddleStage/projectApprovalManagement';

export default {
  name: 'fabuInfo',
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
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {
        auditOpinion: undefined,
        nextAuditPeople: undefined,
        nextAuditPeopleName: undefined,
      },
      layout: [
        {
          title: '处理信息',
          formItems: [
            {
              label: '申请说明',
              prop: 'auditOpinion',
              inputType: 'input',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  auditOpinion: val,
                };
              },
            },
            {
              label: '指定审核人',
              prop: 'nextAuditPeopleName',
              inputType: 'select',
              span: 12,
              onFocus: () => {
                this.peopleData = {
                  ...this.data,
                  ...this.form,
                };
                this.peopleShow = true;
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
          trigger: 'blur',
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
        this.form = {
          ...this.form,
          ...row,
        };
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { row } = this.data;
      const mapOptions = {
        0: 'verify_draft',
      };
      const param = {
        // ...val,
        auditOpinion: val.auditOpinion,
        judgeResult: '4',
        businessId: row.id,
        currStatus: mapOptions[Number(row.status)] || row.status,
        businessCode: row.businessCode,
        nextAuditPeople: this.selectTable.username,
      };
      const message = '更新成功';

      startProcess(param).then((res) => {
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
    closeEdit() {
      this.peopleShow = false;
      this.peopleData = {};
    },
    successEdit(selectTable) {
      console.log('selectTable', selectTable);
      this.selectTable = selectTable;
      this.form = {
        ...this.form,
        nextAuditPeople: selectTable.username,
        nextAuditPeopleName: selectTable.realName,
      };
      this.closeEdit();
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
#fabuInfo {
}
</style>
