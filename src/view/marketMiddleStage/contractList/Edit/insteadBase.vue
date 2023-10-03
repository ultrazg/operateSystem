<template>
  <div id="insteadBase">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      :labelWidth="'140px'"
      @submit="submitForm"
    />
    <wrapper title="项目信息">
      <page-table
        ref="pageTable"
        col-align="left"
        :data="tableData"
        :cols="tableCols"
        :selection="false"
        :operator="false"
        :showPage="false"
        reserveSelection
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
    <cooperationUnits :show="unitShow" :data="unitData" @cancel="closeUnitEdit" @success="successUnitEdit" />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import nextAuditPeople from '@/view/common/nextAuditPeople.vue';
import cooperationUnits from '@/view/common/cooperationUnits';
import { addCooContract } from '@/api/marketMiddleStage/projectApprovalManagement/instead';
import { stationContractList } from '@/api/marketMiddleStage/contractList';

export default {
  name: 'insteadBase',
  components: {
    FormItem,
    wrapper,
    PageTable,
    nextAuditPeople,
    cooperationUnits,
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
          title: '合同信息',
          formItems: [
            {
              label: '合同类型',
              prop: 'contractType',
              inputType: 'select',
              span: 12,
              options: this.common().contractTypeCode,
            },
            {
              label: '合同名称',
              prop: 'contractName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合同编号',
              prop: 'contractNo',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作框架',
              prop: 'frameworkId',
              inputType: 'input',
              span: 12,
              onFocus: (val) => {
                this.unitData = {
                  ...this.data,
                  ...this.form,
                };
                this.unitShow = true;
              },
            },
            {
              label: '合作单位',
              prop: 'unitName',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '省份',
              prop: 'province',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '城市',
              prop: 'city',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '一级专业',
              prop: 'oneMajor',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '合作比例',
              prop: 'ratio',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '合同总金额(含税)',
              prop: 'contractAll',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '合同总金额(不含税)',
              prop: 'contractAllNoTax',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        contractType: {
          required: true,
          message: '请选择合同类型',
          trigger: 'blur',
        },
        contractName: {
          required: true,
          message: '请输入合同名称',
          trigger: 'blur',
        },
      },
      peopleShow: false,
      peopleData: {},
      selectTable: {},
      tableData: [],
      tableCols: [
        {
          label: '项目名称',
          prop: 'projectName',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
        },
        {
          label: '业务确认单号',
          prop: 'busiOrderId',
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
          label: '区县',
          prop: 'area',
        },
        {
          label: '委托模式',
          prop: 'entrustType',
        },
        {
          label: '产品服务费(元/年、含税)',
          prop: 'prodPrice',
        },
        {
          label: '产品服务费(元/年、不含税)',
          prop: 'prodPriceNoTax',
        },
      ],
      unitData: {},
      unitShow: false,
      selectUnitTable: {},
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
    // 请求数据
    reqDetail() {
      const { row } = this.data;

      if (row) {
        stationContractList(row.id).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data,
            };
            this.tableData = res.data.cooperationContractStations;
          }
        });
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    // 提交数据
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const param = {
        ...val,
        ids: this.tableData.map((table) => table.id),
        type: 0,
      };
      const message = '申请成功';

      // 以租代建 生成合作合同
      addCooContract(param).then((res) => {
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
    // 成功预览
    successEdit(selectTable) {
      this.selectTable = selectTable;
      this.form = {
        ...this.form,
        auditPeople: selectTable.username,
        auditPeopleName: selectTable.realName,
      };
      this.closeEdit();
    },
    // 关闭合作合同预览
    closeUnitEdit() {
      this.unitShow = false;
      this.unitData = {};
    },
    // 成功合作合同预览
    successUnitEdit(selectUnitTable) {
      this.selectUnitTable = selectUnitTable;
      this.form = {
        ...this.form,
        unitName: selectUnitTable.unitName,
        frameworkId: selectUnitTable.contractNo,
        province: selectUnitTable.province,
        city: selectUnitTable.city,
        oneMajor: selectUnitTable.oneMajor,
        ratio: selectUnitTable.ratio,
      };
      this.closeUnitEdit();
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
#insteadBase {
  #PageTable {
    min-height: auto;
  }
}
</style>
