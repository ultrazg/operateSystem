<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :labelWidth="'140px'"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
    <frameworkUnits :show="unitShow" :data="unitData" @cancel="closeEdit" @success="successEdit" />
    <purchaseBinding :show="purchaseShow" :data="purchaseData" @cancel="closePurchase" @success="successPurchase" />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import frameworkUnits from '@/view/common/frameworkUnits';
import purchaseBinding from '@/view/common/purchaseBinding';
import {
  cooperationFrameworkDetail,
  addcooperationFramework,
  updatecooperationFramework,
} from '@/api/marketMiddleStage/cooperationFramework';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    frameworkUnits,
    purchaseBinding,
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
        province: undefined,
        city: undefined,
        consignorName: undefined,
        consignor: undefined,
        purchaseProdId: undefined,
        subject: this.common().subjectCode[0].id,
      },
      layout: [
        {
          title: '合作框架信息',
          formItems: [
            {
              label: '框架名称',
              prop: 'contractName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '框架编号',
              prop: 'contractId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '签订日期',
              prop: 'signDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '主体',
              prop: 'subject',
              inputType: 'select',
              span: 12,
              disabled: true,
              options: this.common().subjectCode,
            },
            {
              label: '档案份数',
              prop: 'documents',
              inputType: 'input',
              span: 12,
            },
            {
              label: '存档日期',
              prop: 'documentDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '有效日期起',
              prop: 'validitySDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '有效日期止',
              prop: 'validityEDate',
              inputType: 'dataPicker',
              span: 12,
            },
          ],
        },
        {
          title: '绑定采购信息',
          formItems: [
            {
              label: '采购项目编码',
              prop: 'purchaseProdId',
              inputType: 'select',
              span: 12,
              // 跳转采购项目选择
              onFocus: (val) => {
                this.purchaseData = {
                  ...this.data,
                  ...this.form,
                };
                this.purchaseShow = true;
              },
            },
            {
              label: '采购项目名称',
              prop: 'prodName',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '专业',
              prop: 'oneMajor',
              disabled: true,
              inputType: 'select',
              span: 12,
              options: this.common().majorCode,
            },
            {
              label: '省份',
              prop: 'province',
              disabled: true,
              inputType: 'select',
              span: 12,
              options: this.common().provincialCode,
              onChange: (val) => {
                this.setCity(val);
              },
            },
            {
              label: '城市',
              prop: 'city',
              disabled: true,
              inputType: 'select',
              span: 12,
              options: [],
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  city: val,
                };
              },
            },
            {
              label: '中标人',
              prop: 'unitName',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '中标份额',
              prop: 'winnerLot',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '中标报价',
              prop: 'discountRate',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '中标后执行价格',
              prop: 'performPrice',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '合同控制金额(不含税)',
              prop: 'contractAmountNoRate',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '税率',
              prop: 'taxRate',
              disabled: true,
              multiple: true,
              inputType: 'select',
              span: 12,
              options: this.common().taxRateCode,
            },
            {
              label: '合同税额',
              prop: 'contractRate',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '合同控制金额(含税)',
              prop: 'contractAmount',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '预估比例(%)',
              prop: 'estimate',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '收入金额(不含税)',
              prop: 'income',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作比例(%)',
              prop: 'ratio',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目毛利率(%)',
              prop: 'projectProfitRate',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      // 必填内容
      formRules: {
        contractName: {
          required: true,
          message: '请输入框架名称',
          trigger: 'blur',
        },
        contractId: {
          required: true,
          message: '请输入框架编号',
          trigger: 'blur',
        },
        signDate: {
          required: true,
          message: '请选择签订日期',
          trigger: 'blur',
        },
        purchaseProdId: {
          required: true,
          message: '请选择采购项目编码',
          trigger: 'blur',
        },
      },
      selectTable: {},
      unitShow: false,
      unitData: {},
      purchaseTable: {},
      purchaseShow: false,
      purchaseData: {},
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
    // 请求数据
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        // 承揽框架详情
        cooperationFrameworkDetail(row.id).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data,
              // taxRate: res.data.taxRate ? res.data.taxRate.split(',') : [],
            };
            if (this.form.province) {
              this.setCity(this.form.province);
            }
          }
        });
      }
    },
    // 获取城市
    async setCity(province) {
      this.form = {
        ...this.form,
        province,
        city: undefined,
      };
      const options = this.common().provincialCode;
      const findItem = options.filter((option) => option.id === province);

      if (findItem.length === 0) {
        return;
      }
      const city = await this.$getCode(findItem[0].id);

      console.log('city', city);
      this.$set(this.layout[1].formItems[4], 'options', city);
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    // 提交数据
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const param = {
        ...val,
        // taxRate: val.taxRate.join(','),
        // city: val.city.join(','),
      };

      let message = '新增成功';

      let api = addcooperationFramework;

      // 新增框架列表
      if (configType === 'edit') {
        param.id = this.form.id;
        message = '修改成功';
        api = updatecooperationFramework;
      }
      // 更新框架列表
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
    // 取消提交
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
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
        consignorName: selectTable.name,
        consignor: selectTable.id,
      };
      this.closeEdit();
    },
    // 关闭采购项目选择
    closePurchase() {
      this.purchaseShow = false;
      this.purchaseData = {};
    },
    // 成功选择采购项目
    successPurchase(selectTable) {
      this.purchaseTable = selectTable;
      if (selectTable.province) {
        this.setCity(selectTable.province);
      }
      this.form = {
        ...this.form,
        purchaseProdId: selectTable.purchaseProdId,
        prodName: selectTable.prodName,
        oneMajor: selectTable.oneMajor,
        province: selectTable.province,
        city: selectTable.city,
        unitName: selectTable.unitName,
        unitId: selectTable.unitId,
        winnerLot: selectTable.winnerLot,
        discountRate: selectTable.discountRate,
        performPrice: selectTable.performPrice,
        contractAmountNoRate: selectTable.contractAmountNoRate,
        taxRate: selectTable.taxRate,
        contractRate: selectTable.contractRate,
        contractAmount: selectTable.contractAmount,
        estimate: selectTable.estimate,
        income: selectTable.income,
        ratio: selectTable.ratio,
        projectProfitRate: selectTable.projectProfitRate,
      };
      this.closePurchase();
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
