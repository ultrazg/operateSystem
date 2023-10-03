<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      :label-width="'160px'"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import { stationDetails } from '@/api/costManagement/stationService';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
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
          title: '站点信息',
          formItems: [
            {
              label: '站点名称',
              prop: 'stationName',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '站点类型',
              prop: 'stationType',
              disabled: true,
              inputType: 'select',
              options: this.common().stationType,
              span: 12,
            },
            {
              label: '地市',
              prop: 'city',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '合同编号',
              prop: 'contractNo',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: 'ERP编号',
              prop: 'erpNumber',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '起始日期',
              prop: 'rentTime',
              disabled: true,
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '合同期',
              prop: 'contractTime',
              inputType: 'input',
              span: 12,
            },
            {
              label: '服务费(元/年)',
              prop: 'serviceCharge',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '基准价格税率',
              prop: 'baseTax',
              inputType: 'select',
              span: 12,
              options: this.common().taxRateCode,
              onChange: (val) => {
                const params = this.common().taxRateCode.filter((ele) => ele.id === val)[0];
                const taxValue = Number(params.value);

                // this.form.baseTax = val;
                const { basePrice } = this.form;

                this.form = {
                  ...this.form,
                  baseTax: val,
                  basePriceTax: ((parseFloat(basePrice) * parseFloat(taxValue)) / 100).toFixed(2),
                };
                this.setPrice();
              },
            },
            {
              label: '基准价格(含税)',
              prop: 'basePrice',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form.basePrice = val;
                const { basePrice, baseTax } = this.form;

                if (!baseTax) {
                  return;
                }
                const params = this.common().taxRateCode.filter((ele) => ele.id === baseTax)[0];
                const taxValue = Number(params.value);

                this.form = {
                  ...this.form,
                  basePriceTax: ((parseFloat(basePrice) * parseFloat(taxValue)) / 100).toFixed(2),
                };
                this.setPrice();
              },
            },
            {
              label: '场地费(含税)',
              prop: 'sitePrice',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form.sitePrice = val;
                const { sitePrice, siteTax } = this.form;

                if (!siteTax) {
                  return;
                }
                const params = this.common().taxRateCode.filter((ele) => ele.id === siteTax)[0];
                const taxValue = Number(params.value);

                this.form = {
                  ...this.form,
                  sitePriceTax: ((parseFloat(sitePrice) * parseFloat(taxValue)) / 100).toFixed(2),
                };
                this.setPrice();
              },
            },
            {
              label: '基准价格税额',
              prop: 'basePriceTax',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '场地税额',
              prop: 'sitePriceTax',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '场地费税率',
              prop: 'siteTax',
              inputType: 'select',
              span: 12,
              options: this.common().taxRateCode,
              onChange: (val) => {
                const params = this.common().taxRateCode.filter((ele) => ele.id === val)[0];
                const taxValue = Number(params.value);

                // this.form.siteTax = val;
                const { sitePrice } = this.form;

                this.form = {
                  ...this.form,
                  siteTax: val,
                  sitePriceTax: ((parseFloat(sitePrice) * parseFloat(taxValue)) / 100).toFixed(2),
                };
                this.setPrice();
              },
            },
            {
              label: '电力引入费税率',
              prop: 'electricTax',
              inputType: 'select',
              options: this.common().taxRateCode,
              span: 12,
              onChange: (val) => {
                const params = this.common().taxRateCode.filter((ele) => ele.id === val)[0];
                const taxValue = Number(params.value);

                // this.form.electricTax = val;
                const { electricPrice } = this.form;

                this.form = {
                  ...this.form,
                  electricTax: val,
                  electricPriceTax: ((parseFloat(electricPrice) * parseFloat(taxValue)) / 100).toFixed(2),
                };
                this.setPrice();
              },
            },
            {
              label: '电力引入费(含税)',
              prop: 'electricPrice',
              span: 12,
              inputType: 'inputNumber',
              onChange: (val) => {
                this.form.electricPrice = val;
                const { electricPrice, electricTax } = this.form;

                if (!electricTax) {
                  return;
                }
                const params = this.common().taxRateCode.filter((ele) => ele.id === electricTax)[0];
                const taxValue = Number(params.value);

                this.form = {
                  ...this.form,
                  electricPriceTax: ((parseFloat(electricPrice) * parseFloat(taxValue)) / 100).toFixed(2),
                };
                this.setPrice();
              },
            },
            {
              label: '电力引入税额',
              prop: 'electricPriceTax',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '产品服务费(元/年、不含税)',
              prop: 'prodPriceNoTax',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '产品服务费(元/年、含税)',
              prop: 'prodPrice',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        contractTime: {
          required: true,
          message: '请输入合同期',
          trigger: 'blur',
        },
        serviceCharge: {
          required: true,
          message: '请输入服务费(元/年)',
          trigger: 'blur',
        },
        baseTax: {
          required: true,
          message: '请选择基准价格税率',
          trigger: 'blur',
        },
        basePrice: {
          required: true,
          message: '请输入基准价格(含税)',
          trigger: 'blur',
        },
        sitePrice: {
          required: true,
          message: '请输入场地费(含税)',
          trigger: 'blur',
        },
        siteTax: {
          required: true,
          message: '请选择场地费税率',
          trigger: 'blur',
        },
        electricTax: {
          required: true,
          message: '请选择电力引入费税率',
          trigger: 'blur',
        },
        electricPrice: {
          required: true,
          message: '请输入电力引入费(含税)',
          trigger: 'blur',
        },
      },
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
        stationDetails(row.id).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data,
            };
            const cityErpByParentName = this.common().cityErpByParentCode.filter(
              (cityErpByParentCode) => cityErpByParentCode.id === this.form.city,
            );

            this.form.city = cityErpByParentName[0].name;
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
        // ...val,
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
    setPrice() {
      const { basePriceTax, sitePriceTax, electricPriceTax } = this.form;

      this.form = {
        ...this.form,
        prodPrice: parseFloat(basePriceTax || 0) + parseFloat(sitePriceTax || 0) + parseFloat(electricPriceTax || 0),
      };
      const { basePrice, sitePrice, electricPrice } = this.form;

      this.form = {
        ...this.form,
        prodPriceNoTax:
          parseFloat(basePrice || 0) -
          parseFloat(basePriceTax || 0) +
          (parseFloat(sitePrice || 0) - parseFloat(sitePriceTax || 0)) +
          (parseFloat(electricPrice || 0) - parseFloat(electricPriceTax || 0)),
      };
      console.log('prodPrice', this.form.prodPrice);
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
}
</style>
