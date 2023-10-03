<template>
  <div id="base">
    <FormItem
      ref="lFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
      v-if="type === 'littleStation'"
    />
    <FormItem
      ref="bFormItem"
      :layout="bLayout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
      v-if="type === 'bigStation'"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import { projectStation } from '@/api/costManagement/stationElectric';

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
      isDetail: ['detail'].includes(configType),
      form: {
        stationType: '1',
      },
      layout: [
        {
          title: '站点信息',
          formItems: [
            {
              label: '站点名称',
              prop: 'stationName',
              inputType: 'input',
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
              label: '电费单价(元/年)',
              // prop: 'priceYear',
              prop: 'electricity',
              inputType: 'input',
              span: 12,
            },
            {
              label: 'RRU/AAU设备数量',
              prop: 'devCount',
              inputType: 'input',
              span: 12,
            },
            {
              label: 'ERP编号',
              prop: 'erpNumber',
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
              label: '电表编号',
              prop: 'meterNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '物业编号',
              prop: 'propertyNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '与业主合同签订日期',
              prop: 'signTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '起始日期',
              prop: 'rentTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '电价(元/度)',
              prop: 'priceDegree',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      bLayout: [
        {
          title: '站点信息',
          formItems: [
            {
              label: '站点名称',
              prop: 'stationName',
              inputType: 'input',
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
              label: '电费单价(元/度)',
              prop: 'electricPrice',
              inputType: 'input',
              span: 12,
            },
            {
              label: 'RRU/AAU设备数量',
              prop: 'devCount',
              inputType: 'input',
              span: 12,
            },
            {
              label: 'ERP编号',
              prop: 'erpNumber',
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
              label: '电表编号',
              prop: 'meterNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '物业编号',
              prop: 'propertyNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '与业主合同签订日期',
              prop: 'signTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '起始日期',
              prop: 'rentTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '电价(元/度)',
              prop: 'priceDegree',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      formRules: {},
    };
  },
  watch: {
    data(val) {
      this.inputDisabled = val.configType === 'detail';
      this.isDetail = ['detail'].includes(val.configType);
      if (this.isDetail) {
        this.reqDetail();
      }
    },
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      if (row.city === '广州市' && row.stationType === '小站') {
        this.type = 'littleStation';
      } else {
        this.type = 'bigStation';
      }
      if (row && row.id) {
        projectStation(row.id).then((res) => {
          if (res && res.code === '200' && res.data) {
            if (res.data.stationType) {
              const stationItem = this.common().stationType.filter((station) => station.id === res.data.stationType);

              this.changeStationType(stationItem);
            }
            this.form = {
              ...this.form,
              ...row,
              ...res.data,
            };
            // this.res.data = res.data.electricCostDetailDtoList;
          }
        });
      }
    },
    // 小站宏站显示区别
    changeStationType(stationItem) {
      if (stationItem && stationItem.length > 0) {
        if (stationItem[0].name === '小站') {
          this.layout[0].formItems[2].hide = false;
          this.layout[0].formItems[3].hide = false;
          this.layout[0].formItems[6].hide = true;
          this.layout[0].formItems[10].hide = true;
        } else {
          this.layout[0].formItems[2].hide = true;
          this.layout[0].formItems[3].hide = true;
          this.layout[0].formItems[6].hide = false;
          this.layout[0].formItems[10].hide = false;
        }
      }
    },
    submitFormItem() {
      if (this.type === 'littleStation') {
        this.$refs.lFormItem.submitForm();
      } else {
        this.$refs.bFormItem.submitForm();
      }
    },
    // 提交数据
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const param = {
        // ...val,
      };

      const api = addStationElectric;

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
      const message = configType === 'add' ? '新增成功' : '修改成功';
    },
    cancelForm() {
      this.form = {};
      if (this.type === 'littleStation') {
        this.$refs.lFormItem.cancelForm();
      } else {
        this.$refs.bFormItem.cancelForm();
      }
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
