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
import { detailrecord } from '@/api/qualificationManagement/qualificationInfo';

export default {
  name: 'baseInfo',
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
      form: {},
      layout: [
        {
          title: '申请信息',
          formItems: [
            {
              label: '申请人',
              prop: 'applyPeople',
              inputType: 'input',
              span: 12,
            },
            {
              label: '申请时间',
              prop: 'applyTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '申请资质类型',
              prop: 'qualificationType',
              inputType: 'select',
              span: 12,
              options: this.common().qualificationType,
            },
            {
              label: '申请资质名称',
              prop: 'name',
              inputType: 'input',
              span: 12,
            },
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
        {
          title: '审批信息',
          formItems: [
            {
              label: '审批时间',
              prop: 'approvalTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '审批状态',
              prop: 'applyStatus',
              inputType: 'select',
              span: 12,
              options: this.common().approvalStatus,
            },
            {
              label: '审批意见',
              prop: 'approvalInfo',
              inputType: 'input',
              span: 12,
            },
          ],
        },
        {
          title: '下载信息',
          formItems: [
            {
              label: '下载状态',
              prop: 'auditPeople',
              inputType: 'select',
              span: 12,
              options: this.common().downloadStatusType,
            },
            {
              label: '下载时间',
              prop: 'downloadTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '下载人',
              prop: 'downloadPeople',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      formRules: {},
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
        detailrecord(row.id).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data,
            };
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
    closeEdit() {
      this.peopleShow = false;
      this.peopleData = {};
    },
    successEdit(selectTable) {
      this.selectTable = selectTable;
      this.form = {
        ...this.form,
        nextAuditPeople: selectTable.username,
        nextAuditPeopleName: selectTable.realName,
      };
      this.closeEdit();
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
