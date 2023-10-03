<template>
  <!--协作-添加合作-->
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    appendToBody
    :title="`${title}`"
    width="950px"
    :visible.sync="dialogShow"
    :confirmShow="!inputDisabled"
    :customClass="'addContract'"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <FormItem
        ref="supplyFormItem"
        :layout="layout"
        :rules="formRules"
        :disabled="inputDisabled"
        :form.sync="form"
        @submit="submitForm"
      />
    </div>
    <cooperationUnits :show="unitShow" :data="unitData" @cancel="closeEdit" @success="successEdit" />
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import FormItem from '@/components/formItem';
import cooperationUnits from '@/view/common/cooperationUnits';
import { addCooperationContract } from '@/api/marketMiddleStage/projectApprovalManagement';
export default {
  name: 'addCooperation',
  components: {
    dialogCont,
    FormItem,
    cooperationUnits,
  },
  props: {
    data: {},
    show: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['common'],
  data() {
    const { configType } = this.data;

    return {
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      scrollHeight: 'auto',
      title: '生成合作合同',
      form: {
        unitDetailName: undefined,
        contractAll: 0,
        constructionAll: 0,
        materialAll: 0,
      },
      formRules: {
        contractNo: {
          required: true,
          message: '请输入合同编号',
          trigger: 'blur',
        },
        contractType: {
          required: true,
          message: '请输入合同类型',
          trigger: 'blur',
        },
        contractName: {
          required: true,
          message: '请输入合同名称',
          trigger: 'blur',
        },
        orderId: {
          required: true,
          message: '请输入订单编号',
          trigger: 'blur',
        },
        taxType: {
          required: true,
          message: '请输入计税方式',
          trigger: 'blur',
        },
        contractAll: {
          required: true,
          message: '请输入合同金额',
          trigger: 'blur',
        },
        constructionAll: {
          required: true,
          message: '请输入总施工费',
          trigger: 'blur',
        },
        materialAll: {
          required: true,
          message: '请输入总材料费',
          trigger: 'blur',
        },
        construction: {
          required: true,
          message: '请选择施工费',
          trigger: 'blur',
        },
        constructionRate: {
          required: true,
          message: '请选择施工费税率',
          trigger: 'blur',
        },
        constructionTax: {
          required: true,
          message: '请输入施工税',
          trigger: 'blur',
        },
        material: {
          required: true,
          message: '请输入材料费',
          trigger: 'blur',
        },
        materialRate: {
          required: true,
          message: '请选择材料费税率',
          trigger: 'blur',
        },
        materialTax: {
          required: true,
          message: '请输入材料税',
          trigger: 'blur',
        },
        provisionalTax: {
          required: true,
          message: '请输入预缴税',
          trigger: 'blur',
        },
        security: {
          required: true,
          message: '请输入安全费',
          trigger: 'blur',
        },
        other: {
          required: true,
          message: '请输入其他费用',
          trigger: 'blur',
        },
      },
      layout: [
        {
          title: '合作信息',
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
              label: '合作单位',
              prop: 'unitDetailName',
              inputType: 'select',
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
              label: '订单编号',
              prop: 'orderId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '计税方式',
              prop: 'taxType',
              inputType: 'select',
              span: 12,
              options: this.common().taxTypeCode,
            },
            {
              label: '文件数',
              prop: 'documents',
              precision: 0,
              min: 0,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '存档日期',
              prop: 'documentDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '签订日期',
              prop: 'signDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '创建人',
              prop: 'createPeople',
              inputType: 'input',
              span: 12,
            },
            {
              label: '创建时间',
              prop: 'createTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '备注',
              prop: 'remark',
              inputType: 'textarea',
              span: 24,
            },
          ],
        },
        {
          title: '合作合同累计金额信息',
          formItems: [
            {
              label: '合同金额',
              prop: 'contractAll',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '总施工费',
              prop: 'constructionAll',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '总材料费',
              prop: 'materialAll',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '施工费',
              prop: 'construction',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.form.construction === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  construction: val,
                };
                const { construction, constructionRate } = this.form;

                if (!constructionRate || !construction) {
                  this.form.constructionTax = 0;

                  return;
                }
                const taxRetaValue = constructionRate.split('_')[1];

                const amountTax = ((parseFloat(construction || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);
                // console.log(amountTax);

                this.form.constructionTax = amountTax;

                // 合计
                this.form.constructionAll = parseFloat(construction || 0) + parseFloat(amountTax || 0);

                // 合同总额

                this.form.contractAll = this.getContractAll();
              },
            },
            {
              label: '施工费税率',
              prop: 'constructionRate',
              inputType: 'select',
              span: 12,
              options: this.common().taxRateCode,
              onChange: (val) => {
                if (this.form.constructionRate === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  constructionRate: val,
                };
                const taxRetaValue = val.split('_')[1];
                const { construction, constructionRate } = this.form;

                if (!constructionRate || !construction) {
                  this.form.constructionTax = 0;

                  return;
                }
                const amountTax = ((parseFloat(construction || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);
                // console.log(amountTax);

                this.form.constructionTax = amountTax;

                // 合计
                this.form.constructionAll = parseFloat(construction || 0) + parseFloat(amountTax || 0);
                // 合同总额

                this.form.contractAll = this.getContractAll();
              },
            },
            {
              label: '施工税',
              prop: 'constructionTax',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '材料费',
              prop: 'material',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.form.material === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  material: val,
                };
                const { material, materialRate } = this.form;

                if (!materialRate || !material) {
                  this.form.materialTax = 0;

                  return;
                }
                const taxRetaValue = materialRate.split('_')[1];

                const amountTax = ((parseFloat(material || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);
                // console.log(amountTax);

                this.form.materialTax = amountTax;
                console.log('material', material, amountTax);
                this.form.materialAll = parseFloat(material || 0) + parseFloat(amountTax || 0);

                // 合同总额
                this.form.contractAll = this.getContractAll();
              },
            },
            {
              label: '材料费税率',
              prop: 'materialRate',
              inputType: 'select',
              span: 12,
              options: this.common().taxRateCode,
              onChange: (val) => {
                if (this.form.materialRate === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  materialRate: val,
                };
                const taxRetaValue = val.split('_')[1];
                const { material, materialRate } = this.form;

                if (!materialRate || !material) {
                  this.form.materialTax = 0;

                  return;
                }

                const amountTax = ((parseFloat(material || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);
                // console.log(amountTax);

                this.form.materialTax = amountTax;
                this.form.materialAll = parseFloat(material || 0) + parseFloat(amountTax || 0);

                // 合同总额

                this.form.contractAll = this.getContractAll();
              },
            },
            {
              label: '材料税',
              prop: 'materialTax',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '预缴税',
              prop: 'provisionalTax',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.form.provisionalTax === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  provisionalTax: val,
                };

                this.form.contractAll = this.getContractAll();
              },
            },
            {
              label: '安全费',
              prop: 'security',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.form.security === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  security: val,
                };
                this.form.contractAll = this.getContractAll();
              },
            },
            {
              label: '其他费用',
              prop: 'other',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.form.other === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  other: val,
                };
                this.form.contractAll = this.getContractAll();
              },
            },
          ],
        },
      ],
      selectTable: {},
      unitShow: false,
      unitData: {},
    };
  },
  computed: {
    dialogShow: {
      get() {
        return this.show;
      },
      set(v) {
        console.log('set');
      },
    },
  },
  methods: {
    // openedit() {
    // },
    // 获取所有合同信息
    getContractAll() {
      const { provisionalTax, constructionAll, materialAll, other, security } = this.form;

      console.log('security', security, other);

      return (
        parseFloat(constructionAll || 0) +
        parseFloat(materialAll || 0) +
        parseFloat(provisionalTax || 0) +
        parseFloat(other || 0) +
        parseFloat(security || 0)
      );
    },
    // 提交数据
    submitForm(val) {
      const { erpNumber, multipleSelection } = this.data;

      const splitSubExeDetailCommand = [];

      console.log('multipleSelection', multipleSelection);
      multipleSelection.forEach((item) => {
        splitSubExeDetailCommand.push({
          ...val,
          cooContractId: `${item.cooContractId}`,
          splitId: item.parentId,
          unitDetailId: `${this.selectTable.id}`,
        });
      });
      const param = {
        contractNo: val.contractNo,
        erpNumber,
        splitSubExeDetailCommand,
      };

      const message = '生成合作合同成功';

      const api = addCooperationContract;
      // 新增协作项目合作合同

      api(param).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right',
          });
          this.form = {};
          this.$refs.supplyFormItem.cancelForm();
          this.$emit('success');
        }
      });
    },
    closeedit() {
      this.form = {};
      this.canceledit();
    },
    // 取消预览
    canceledit(type) {
      this.$refs.supplyFormItem.cancelForm();
      this.$emit('cancel', type);
    },
    // 提交预览
    confirmedit() {
      this.$refs.supplyFormItem.submitForm();
    },
    successSubmit() {
      this.closeedit();
      this.$emit('success');
    },
    // 关闭预览
    closeEdit() {
      this.unitShow = false;
      this.unitData = {};
    },
    // 成功预览
    successEdit(selectTable) {
      console.log('selectTable', selectTable);
      this.selectTable = selectTable;
      this.form = {
        ...this.form,
        unitDetailId: selectTable.id,
        unitDetailName: selectTable.unitName,
      };
      // this.form.unitDetailId = selectTable.id;
      // this.form.unitDetailName = selectTable.unitName;
      this.closeEdit();
    },
  },
};
</script>

<style lang="less">
.showContract {
  .comp-page-table {
    min-height: auto;
  }
}
</style>
