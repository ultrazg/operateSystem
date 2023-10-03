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
    >
      <template slot="orderId">
        <page-table ref="pageTable" col-align="left" :data="orderTableData" :cols="orderTableCols" :showPage="false">
        </page-table>
      </template>
    </FormItem>
    <outerManagementSelect
      :show="outerManagementShow"
      :data="outerManagementData"
      :filterArray="['核销']"
      @cancel="closeouterManagement"
      @success="successouterManagement"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import PageTable from '@/components/page-table';
import outerManagementSelect from '@/view/common/outerManagementSelect';
import { deatilWriteOff, addWriteOff, editWriteOff } from '@/api/outermanagement/writeOffManagement';

export default {
  name: 'writeOffInfo',
  components: {
    FormItem,
    outerManagementSelect,
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
          title: '外经证信息',
          formItems: [
            {
              label: '外经证编号',
              prop: 'outerCode',
              disabled: false,
              inputType: 'select',
              span: 12,
              onFocus: (val) => {
                this.outerManagementData = {
                  ...this.data,
                  ...this.form,
                  reqData: {
                    excludeWriteOffs: '1',
                    backFillStatus: 1,
                  },
                };
                this.outerManagementShow = true;
              },
            },
            {
              label: '外经证名称',
              prop: 'outerName',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '有效期起',
              prop: 'startTime',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '有效期止',
              prop: 'endTime',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '涉税金额',
              prop: 'taxAmount',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '经办人电话',
              prop: 'operatorTel',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '经营方式',
              prop: 'modeType',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '联系人',
              prop: 'contactP',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '承揽框架名称',
              prop: 'frameworkName',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
          ],
        },
        {
          title: '绑定承揽订单',
          render: 'orderId',
        },
        {
          title: '核销信息记录',
          formItems: [
            {
              label: '上传附件',
              prop: 'fileList',
              disabled: false,
              placeholder: '支持pdf/.jpg/.png格式文件',
              limit: 5,
              accept: '.jpg, .png, .pdf, .jpeg',
              inputType: 'upload',
              params: {
                filePath: 'fileUpload',
                serviceCode: 'financeCancel',
              },
              span: 12,
            },
          ],
        },
      ],
      orderTableData: [],
      orderTableCols: [
        {
          label: '承揽订单',
          prop: 'orderId',
        },
        {
          label: '承揽订单编码',
          prop: 'billId',
        },
        {
          label: '合同金额',
          prop: 'contractAll',
        },
        {
          label: 'ERP编码',
          prop: 'erpNumber',
        },
        {
          label: '项目名称',
          prop: 'name',
        },
        {
          label: '省份',
          prop: 'province',
        },
        {
          label: '地市',
          prop: 'city',
        },
        {
          label: '区/县',
          prop: 'area',
        },
      ],
      upload: [
        {
          label: '延期申请单号',
          prop: 'extensionApplyNumber',
        },
        {
          label: '延长期起',
          prop: 'startTime',
        },
        {
          label: '延长期止',
          prop: 'endTime',
        },
        {
          label: '申请人',
          prop: 'apply',
        },
        {
          label: '申请时间',
          prop: 'applyTime',
        },
      ],

      outerManagementShow: false,
      outerManagementData: false,
      formRules: {
        outerCode: {
          required: true,
          message: '请选择外经证编号',
          trigger: 'blur',
        },
      },
      orderIdOtherBtnLists: [],
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
    successouterManagement(selectTable) {
      console.log(selectTable);
      this.selectTable = selectTable;

      this.form = {
        ...this.form,
        outerId: selectTable.id,
        outerCode: selectTable.outerCode,
        outerName: selectTable.outerName,
        startTime: selectTable.startTime,
        endTime: selectTable.endTime,
        taxAmount: selectTable.taxAmount,
        operatorTel: selectTable.operatorTel,
        modeType: selectTable.modeType,
        contactP: selectTable.contactP,
        frameworkName: selectTable.frameworkName,
      };
      this.orderTableData = selectTable.hireOrderList;
      this.extensionInfoData = selectTable.financeDelayList;
    },
    closeouterManagement() {
      this.outerManagementShow = false;
      this.outerManagementData = [];
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        deatilWriteOff(row.id).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data.financeDetail,
              fileList: res.data.fileList,
              id: row.id,
            };
            this.layout[0].formItems[0].disabled = true;
            this.orderTableData = res.data.hireList;
          }
        });
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;

      let param = {
        outerId: val.outerId,
        fileList: val.fileList,
      };

      const message = configType === 'add' ? '新增成功' : '修改成功';

      let api = addWriteOff;

      if (id) {
        api = editWriteOff;
        param = {
          id,
          fileList: val.fileList,
        };
      }
      api(param).then((res) => {
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
