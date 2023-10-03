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
    <wrapper title="申请资质">
      <page-table
        ref="pageTable"
        col-align="left"
        :data="tableData"
        :cols="tableCols"
        :selection="false"
        :operator="false"
        :showPage="false"
        reserveSelection
        hideDefaultIndex
      >
      </page-table>
    </wrapper>
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
import wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import nextAuditPeople from '@/view/common/nextAuditPeople.vue';
import { applycompany } from '@/api/qualificationManagement/qualificationCompany';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    wrapper,
    PageTable,
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
            {
              label: '指定审批人',
              prop: 'auditPeopleName',
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
        auditPeople: {
          required: true,
          message: '请选择指定审批人',
          trigger: 'blur',
        },
      },
      peopleShow: false,
      peopleData: {},
      selectTable: {},
      tableData: [],
      tableCols: [
        {
          label: '资质类型',
          prop: 'qualificationType',
        },
        {
          label: '资质名称',
          prop: 'name',
        },
        {
          label: '资质等级',
          prop: 'level',
        },
        {
          label: '颁发机构',
          prop: 'issuingAuthority',
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

      if (row) {
        // this.form = {
        //   ...this.form,
        //   ...row,
        // };
        this.tableData = row;
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
        idList: this.tableData.map((table) => table.id),
        type: 0,
      };
      const message = '申请成功';

      applycompany(param).then((res) => {
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
        auditPeople: selectTable.username,
        auditPeopleName: selectTable.realName,
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
  #PageTable {
    min-height: auto;
  }
}
</style>
