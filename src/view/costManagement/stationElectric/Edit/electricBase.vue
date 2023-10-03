<template>
  <div id="electricBase">
    <FormItem
      v-if="type === 'littleStation'"
      ref="xFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :labelWidth="'150px'"
      :form.sync="form"
      @submit="submitForm"
    />
    <FormItem
      v-if="type === 'bigStation'"
      ref="hFormItem"
      :layout="hLayout"
      :rules="hFormRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :labelWidth="'150px'"
      :form.sync="form"
      @submit="submitForm"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import { addElectricCost, editElectricCost } from '@/api/costManagement/stationElectric';
import moment from 'moment';

export default {
  name: 'electricBase',
  components: {
    FormItem,
  },
  props: {
    show: Boolean,
    data: {},
    type: {
      type: String,
      default: '',
    },
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
          title: '站点电费详情',
          formItems: [
            {
              label: '截止日期',
              prop: 'endTime',
              inputType: 'dataPicker',
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
              label: '本次申请支付年限(年)',
              prop: 'limitYear',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '电费单价(元/年)',
              prop: 'electricity',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: 'RRU/AAU设备数量',
              prop: 'devCount',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '成本金额',
              prop: 'cost',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        endTime: {
          required: true,
          message: '请选择截止日期',
          trigger: 'blur',
        },
      },
      hform: {},
      hLayout: [
        {
          title: '站点电费详情',
          formItems: [
            {
              label: '截止日期',
              prop: 'endTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '本次读数(度)',
              prop: 'degreeThis',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '起始日期',
              prop: 'startTime',
              disabled: true,
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '上次读数(度)',
              prop: 'degreeLast',
              disabled: false,
              // disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '本次缴纳度数(度)',
              prop: 'degree',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '电价(元/度)',
              prop: 'electricityPrice',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '成本金额',
              prop: 'cost',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
          ],
        },
      ],
      hFormRules: {
        endTime: {
          required: true,
          message: '请选择截止日期',
          trigger: 'blur',
        },
        degreeThis: {
          required: true,
          message: '请输入本次读数(度)',
          trigger: 'blur',
        },
      },
    };
  },
  computed: {
    degreeThis() {
      return this.form.degreeThis;
    },
    degreeLast() {
      return this.form.degreeLast;
    },
    endTime() {
      return this.form.endTime;
    },
  },
  watch: {
    data(val) {
      this.inputDisabled = val.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      // if (!this.isAdd) {
      this.reqDetail();
      // }
    },
    degreeThis(degreeThisNew) {
      if (degreeThisNew < this.form.degreeLast) {
        this.$notifyError('本次读数不能小于上次读数');

        return;
      }
      this.form.degree = degreeThisNew - this.form.degreeLast; // 计算本次缴纳度数(度)  --  宏站,除开广州以外的小站
      this.form.cost = this.form.degree * this.form.electricityPrice; // 计算成本金额 --   宏站,除开广州以外的小站
    },
    degreeLast(degreeLastNew) {
      if (this.degreeThis && this.degreeThis < degreeLastNew) {
        this.$notifyError('本次读数不能小于上次读数');

        return;
      }
      if (Boolean(this.degreeThis)) {
        if (this.type === 'littleStation') {
          // 广州的小站
        } else {
          // 宏站,除开广州以外的小站
          this.form.degree = this.degreeThis - degreeLastNew; // 计算本次缴纳度数(度)
          this.form.cost = this.form.degree * this.form.electricityPrice; // 计算成本金额  (电费单价*度数)
        }
      }
    },
    endTime(endTimeNew) {
      if (this.type === 'littleStation') {
        // 广州的小站
        if (endTimeNew < this.form.startTime) {
          this.$notifyError('截止日期不能小于起始日期');

          return;
        }
        const date1 = new Date(endTimeNew); // 截止日期
        const date2 = new Date(this.form.startTime); // 截止日期
        const date3 = date1.getTime() - date2.getTime(); // 时间差的毫秒数
        const days = Math.floor(date3 / (24 * 3600 * 1000)); // 计算出相差天数
        const limitYear = days / 365; // 计算出相差年

        this.form.limitYear = limitYear.toFixed(2);
        this.form.cost = this.form.devCount * this.form.limitYear * this.form.electricity; // 计算成本金额 --   广州的小站 --设备数量*年限*年单价
      }
    },
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        let startTime = row.detailsData.rentTime; // 起租日期

        let { rentTime } = row.detailsData;

        let degreeLast = 0;

        if (row.tableData && row.tableData.length > 0) {
          // startTime = row.tableData[row.tableData.length - 1].endTime;
          // degreeLast = row.tableData[row.tableData.length - 1].degreeThis;
          startTime = row.tableData[0].endTime;
          degreeLast = row.tableData[0].degreeThis || 0;
          this.hLayout[0].formItems[3].disabled = true;
        } else {
          startTime = row.detailsData.rentTime;
          degreeLast = 0;
          this.hLayout[0].formItems[3].disabled = false;
        }
        startTime = moment(new Date(new Date(startTime) / 1000 + 86400) * 1000).format('YYYY-MM-DD');
        rentTime = startTime;
        if (this.type === 'littleStation') {
          // 广州的小站
          this.form = {
            ...this.form,
            ...row.detailsData,
            startTime,
            rentTime,
            limitYear: row.detailsData.limitYear,
            electricity: row.detailsData.electricity,
            devCount: row.detailsData.devCount,
            cost: row.detailsData.cost,
          };
        } else {
          // 宏站、除开广州以外的小站
          this.form = {
            ...this.form,
            ...row.detailsData,
            startTime,
            rentTime,
            degreeLast,
            degree: row.detailsData.degree,
            devCount: row.detailsData.devCount,
            cost: row.detailsData.cost,
            electricityPrice: row.detailsData.electricityPrice,
          };
        }
        // const { limitYear, electricity, devCount } = this.form;
        // 本次申请支付年限(年)*电费单价(元/年)*RRU/AAU设备数量
        // this.form.cost = parseFloat(limitYear || 0) * parseFloat(electricity || 0) * parseFloat(devCount || 0);
        console.log('this.form===', this.form);
      }
    },
    submitFormItem() {
      if (this.$refs.xFormItem) {
        this.$refs.xFormItem.submitForm();
      }
      if (this.$refs.hFormItem) {
        this.$refs.hFormItem.submitForm();
      }
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;

      const param = {
        ...val,
        stationId: row.id,
      };

      if (val.degreeThis && val.degreeThis < val.degreeLast) {
        this.$notifyError('本次读数不能小于上次读数');

        return;
      }
      if (val.endTime < val.startTime) {
        this.$notifyError('截止日期不能小于起始日期');

        return;
      }

      const api = addElectricCost;

      if (configType === 'edit') {
        param = {
          ...param,
          id: row.id,
        };
        api = editElectricCost;
      }
      const message = configType === 'add' ? '新增成功' : '修改成功';

      // 修改站点月份电费详情
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
      if (this.type === 'littleStation') {
        this.$refs.xFormItem.cancelForm();
      } else {
        this.$refs.hFormItem.cancelForm();
      }
    },
  },
  created() {
    // if (this.isAdd === false) {
    this.reqDetail();
    // }
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
