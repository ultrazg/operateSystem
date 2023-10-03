<template>
  <div id="insteadBase">
    <!--以租代建-新增-编辑-查看页面模块-->
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      :labelWidth="'160px'"
      @submit="submitForm"
      @change="changeForm"
    />
    <!-- <nextAuditPeople :show="peopleShow" :data="peopleData" @cancel="closeEdit" @success="successEdit" /> -->
    <!-- <opportunitySelection
      :show="opportunitySelectionShow"
      :data="opportunitySelectionData"
      @cancel="closeopportunitySelection"
      @success="successopportunitySelection"
    />
    <hireFrameWorkSelect
      :show="hireFrameWorkShow"
      :data="hireFrameWorkData"
      @cancel="closehireFrameWork"
      @success="successhireFrameWork"
    /> -->
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import { selectListByParentCode, getcityErpByParentCode } from '@/api/common';
import { detail, addStation, updateStation } from '@/api/marketMiddleStage/projectApprovalManagement/instead';
export default {
  name: 'insteadBaseInfo',
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
      form: {
        stationStatus: '1',
      },
      layout: [
        {
          title: '立项信息',
          formItems: [
            {
              label: '项目名称(站点)',
              prop: 'name',
              inputType: 'input',
              span: 12,
            },
            {
              label: '业务确认单号',
              prop: 'busiOrderId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '省份',
              prop: 'province',
              inputType: 'select',
              span: 12,
              options: this.common().provincialCode.filter((codeItem) => ['广东省'].includes(codeItem.name)),
              onChange: (val) => {
                this.setCity(val);
              },
            },
            {
              label: '城市',
              prop: 'city',
              inputType: 'select',
              span: 12,
              options: [],
              onChange: (val) => {
                const { options } = this.layout[0].formItems[3];
                const cityItem = options.filter((option) => option.id === val);

                this.form = {
                  ...this.form,
                  city: val,
                  cityErp: cityItem && cityItem[0].cityErp,
                };

                this.setArea(val);
              },
            },
            {
              label: '区/县',
              prop: 'area',
              inputType: 'select',
              span: 12,
              options: [],
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  area: val,
                };
              },
            },
            {
              label: 'erp编号',
              prop: 'cityErp',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '经度',
              prop: 'longitude',
              inputType: 'input',
              span: 12,
            },
            {
              label: '纬度',
              prop: 'latitude',
              inputType: 'input',
              span: 12,
            },
            {
              label: '一级专业',
              prop: 'oneMajor',
              inputType: 'select',
              span: 12,
              options: this.common().majorCode,
              onChange: (val) => {
                this.setTwoMajor(val);
              },
            },
            {
              label: '二级专业',
              prop: 'twoMajor',
              inputType: 'select',
              span: 12,
              options: [],
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  twoMajor: val,
                };
              },
            },
            {
              label: '网络类型',
              prop: 'internetType',
              inputType: 'input',
              span: 12,
              options: this.common().supervisionUnitCode,
            },
            {
              label: '设备型号',
              prop: 'devType',
              inputType: 'input',
              span: 12,
            },
            {
              label: 'RRU序列号',
              prop: 'rruSerial',
              inputType: 'input',
              span: 12,
            },
            {
              label: '起租日期',
              prop: 'rentTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '委托单号',
              prop: 'entrustId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '委托模式',
              prop: 'entrustType',
              inputType: 'select',
              span: 12,
              options: this.common().entrustType,
            },
            {
              label: '结算方式',
              prop: 'settlementType',
              inputType: 'select',
              span: 12,
              options: this.common().settlementType,
            },
            {
              label: '合同期按年',
              prop: 'contractYear',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '租赁次数',
              prop: 'rentals',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '站点状态',
              prop: 'stationStatus',
              inputType: 'select',
              span: 12,
              options: this.common().stationStatus,
              onChange: (val) => {
                this.layout[0].formItems[20].hide = val === '1';
              },
            },
            {
              label: '拆站日期',
              prop: 'splitTime',
              hide: true,
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '站点类型',
              prop: 'stationType',
              inputType: 'select',
              span: 12,
              options: this.common().stationType,
              onChange: (val) => {
                console.log('val', val);
                const stationItem = this.common().stationType.filter((station) => station.id === val);

                this.changeStationType(stationItem);
              },
            },
            {
              label: '物业编号',
              prop: 'propertyNumber',
              inputType: 'input',
              span: 12,
            },
          ],
        },
        {
          title: '站点台帐信息',
          formItems: [
            {
              label: '服务费(元/年)',
              prop: 'serviceCharge',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '合同期(年)',
              prop: 'contractTime',
              inputType: 'inputNumber',
              span: 12,
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
              label: '基准价格税额',
              prop: 'basePriceTax',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
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
              label: '场地税额',
              prop: 'sitePriceTax',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '电力引入费(含税)',
              prop: 'electricPrice',
              inputType: 'inputNumber',
              span: 12,
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
              label: '电力引入费税率',
              prop: 'electricTax',
              inputType: 'select',
              span: 12,
              options: this.common().taxRateCode,
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
              label: '电力引入税额',
              disabled: true,
              prop: 'electricPriceTax',
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
            {
              label: '产品服务费(元/年、不含税)',
              prop: 'prodPriceNoTax',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '电费单价(元/年)',
              prop: 'electricity',
              hide: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: 'RRU/AAU设备数量',
              prop: 'devCount',
              hide: true,
              inputType: 'inputNumber',
              precision: 0,
              span: 12,
            },
            {
              label: '电价(元/度)',
              prop: 'electricityPrice',
              hide: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '电表编号',
              prop: 'meterNumber',
              hide: true,
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      // 必填内容
      formRules: {
        name: {
          required: true,
          message: '请输入项目名称',
          trigger: 'blur',
        },
        busiOrderId: {
          required: true,
          message: '请输入业务确认单号',
          trigger: 'blur',
        },
        province: {
          required: true,
          message: '请选择省份',
          trigger: 'blur',
        },
        city: {
          required: true,
          message: '请选择城市',
          trigger: 'blur',
        },
        area: {
          required: true,
          message: '请选择区/县',
          trigger: 'blur',
        },
        oneMajor: {
          required: true,
          message: '请选择一级专业',
          trigger: 'blur',
        },
        twoMajor: {
          required: true,
          message: '请选择二级专业',
          trigger: 'blur',
        },
        rentTime: {
          required: true,
          message: '请选择起租日期',
          trigger: 'blur',
        },
        entrustId: {
          required: true,
          message: '请选择委托单号',
          trigger: 'blur',
        },
        entrustType: {
          required: true,
          message: '请选择委托模式',
          trigger: 'blur',
        },
        stationStatus: {
          required: true,
          message: '请选择站点状态',
          trigger: 'blur',
        },
        serviceCharge: {
          required: true,
          message: '请输入服务费(元/年)',
          trigger: 'blur',
        },
        contractTime: {
          required: true,
          message: '请输入合同期',
          trigger: 'blur',
        },
        basePrice: {
          required: true,
          message: '请输入基准价格(含税)',
          trigger: 'blur',
        },
        baseTax: {
          required: true,
          message: '请输入基准价格税率',
          trigger: 'blur',
        },
        sitePrice: {
          required: true,
          message: '请输入场地费(含税)',
          trigger: 'blur',
        },
        siteTax: {
          required: true,
          message: '请输入场地费税率',
          trigger: 'blur',
        },
        electricPrice: {
          required: true,
          message: '请输入电力引入费(含税)',
          trigger: 'blur',
        },
        electricTax: {
          required: true,
          message: '请输入电力引入费税率',
          trigger: 'blur',
        },
        stationType: {
          required: true,
          message: '请选择站点类型',
          trigger: 'blur',
        },
        propertyNumber: {
          required: true,
          message: '请输入物业编号',
          trigger: 'blur',
        },
        electricity: {
          required: true,
          message: '请输入电费单价(元/年)',
          trigger: 'blur',
        },
        devCount: {
          required: true,
          message: '请输入RRU/AAU设备数量',
          trigger: 'blur',
        },
        electricityPrice: {
          required: true,
          message: '请输入电价(元/度)',
          trigger: 'blur',
        },
        meterNumber: {
          required: true,
          message: '请输入电表编号',
          trigger: 'blur',
        },
      },
    };
  },
  mounted() {
    // this.$nextTick(() => {});
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
    // 省份下拉框
    getSelectListByParentCode(province) {
      getcityErpByParentCode(province).then((res) => {
        if (res && res.code === '200') {
          const cityOptions = res.data.map((item) => ({
            name: item.name,
            id: item.code,
          }));
        }
      });
    },
    // 请求数据
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        detail(row.id).then(async (res) => {
          if (res && res.code === '200') {
            if (res.data.province) {
              await this.setCity(res.data.province);
            }
            if (res.data.city) {
              await this.setArea(res.data.city);
            }
            if (res.data.oneMajor) {
              this.setTwoMajor(res.data.oneMajor);
            }
            if (res.data.stationType) {
              const stationItem = this.common().stationType.filter((station) => station.id === res.data.stationType);

              this.changeStationType(stationItem);
            }
            this.layout[0].formItems[20].hide = res.data.stationStatus === '1';
            this.form = {
              ...this.form,
              ...res.data,
            };
          }
        });
      }
    },
    changeStationType(stationItem) {
      if (stationItem && stationItem.length > 0) {
        if (stationItem[0].name === '小站') {
          this.layout[1].formItems[13].hide = false;
          this.layout[1].formItems[14].hide = false;
          this.layout[1].formItems[15].hide = true;
          this.layout[1].formItems[16].hide = true;
          this.formRules.electricity.required = true;
          this.formRules.devCount.required = true;
          this.formRules.electricityPrice.required = false;
          this.formRules.meterNumber.required = false;
        } else {
          this.layout[1].formItems[13].hide = true;
          this.layout[1].formItems[14].hide = true;
          this.layout[1].formItems[15].hide = false;
          this.layout[1].formItems[16].hide = false;
          this.formRules.electricity.required = false;
          this.formRules.devCount.required = false;
          this.formRules.electricityPrice.required = true;
          this.formRules.meterNumber.required = true;
        }
        this.$refs.supplyFormItem.clearValidate();
      }
    },
    async setCity(val) {
      this.form = {
        ...this.form,
        province: val,
        city: undefined,
      };
      const options = this.common().provincialCode;
      const findItem = options.filter((option) => option.id === val);

      if (findItem.length === 0) {
        return;
      }
      const city = await this.$getCodeV1(findItem[0].id);

      this.$set(this.layout[0].formItems[3], 'options', city);
    },
    async setArea(val) {
      this.val = val;
      this.form = {
        ...this.form,
        city: val,
        area: undefined,
      };
      const { options } = this.layout[0].formItems[3];

      console.log('options', options);

      const findItem = options.filter((option) => option.id === val);

      if (findItem.length === 0) {
        return;
      }
      const area = await this.$getCode(findItem[0].id, 'area');

      console.log('area', area);

      this.$set(this.layout[0].formItems[4], 'options', area);
    },

    // 二级专业
    async setTwoMajor(val) {
      this.form = {
        ...this.form,
        oneMajor: val,
        twoMajor: undefined,
      };
      const options = this.common().majorCode;
      const findItem = options.filter((option) => option.id === val);

      if (findItem.length === 0) {
        return;
      }

      const twoMajor = await this.$getCode(findItem[0].id);

      console.log('twoMajor', twoMajor);

      this.$set(this.layout[0].formItems[9], 'options', twoMajor);
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    // 价格相关
    setPrice() {
      const { basePrice, sitePrice, electricPrice, basePriceTax, sitePriceTax, electricPriceTax } = this.form;

      this.form = {
        ...this.form,
        prodPrice: parseFloat(basePrice || 0) + parseFloat(sitePrice || 0) + parseFloat(electricPrice || 0),
      };

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
    // 更改内容
    changeForm(val) {
      this.form = {
        ...val,
      };
    },
    // 提交数据
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;

      let param = {
        ...val,
      };

      let api = addStation;

      if (configType === 'edit') {
        param = {
          ...param,
          id: row.id,
        };
        api = updateStation;
      }
      const message = configType === 'add' ? '新增成功' : '修改成功';

      // 修改小站
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
}
</style>
