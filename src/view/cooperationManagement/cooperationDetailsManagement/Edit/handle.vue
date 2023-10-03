<template>
  <div id="base">
    <formItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      :labelWidth="'140px'"
      @submit="submitForm"
    />
    <!-- <formItem ref="cooperateItem" :layout="cooperateLayout" :disabled="true" :isEdit="false" :form.sync="cooperateForm" /> -->
    <cooperation-dialog
      :show="cooperationShow"
      :data="cooperationData"
      @cancel="closeCooperation"
      @success="successCooperation"
    />
  </div>
</template>

<script>
import formItem from '@/components/formItem';
import cooperationDialog from '@/components/cooperationDialog';
import { updateV1CooperationDetails, saveCooperationDetails } from '@/api/cooperationUnitManagement/index';

export default {
  name: 'baseInfo',
  components: {
    formItem,
    cooperationDialog,
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
          title: '合作单位数据',
          disabled: true,
          formItems: [
            {
              label: '合作框架',
              prop: 'contractNo',
              inputType: 'input',
              span: 12,
              hide: false,
              onFocus: (val) => {
                this.cooperationData = {
                  ...this.data,
                  ...this.form,
                };
                this.cooperationShow = true;
              },
            },
            {
              label: '合作单位',
              prop: 'unitName',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            // {
            //   label: '合作合同总额(万元)',
            //   prop: 'cooConAllAmount',
            //   inputType: 'input',
            //   span: 12,
            // },
            {
              label: '省份',
              prop: 'areaPro',
              inputType: 'select',
              span: 12,
              options: this.common().provincialCode,
              disabled: true,
              onChange: (val) => {
                this.setCity(val);
                this.isProChange = true;
              },
            },
            {
              label: '城市',
              prop: 'areaCity',
              inputType: 'select',
              span: 12,
              disabled: true,
            },
            {
              label: '一级专业',
              prop: 'oneMajor',
              inputType: 'select',
              span: 12,
              disabled: true,
              options: this.common().majorCode,
              onChange: (val) => {
                this.form.oneMajor = val;
                this.isMajorChange = true;
              },
            },
            {
              label: '合作比例',
              prop: 'ratio',
              inputType: 'input',
              span: 12,
            },
            {
              label: '预估比例',
              prop: 'estimate',
              inputType: 'input',
              span: 12,
            },
            {
              label: '开始时间',
              prop: 'sTime',
              inputType: 'dataPicker',
              span: 12,
              props: {
                type: 'date',
                format: 'yyyy-MM-dd',
                fieldName: 'signDate',
                placeholder: '请选择开始时间',
              },
            },
            {
              label: '结束时间',
              prop: 'eTime',
              inputType: 'dataPicker',
              span: 12,
              props: {
                type: 'date',
                format: 'yyyy-MM-dd',
                fieldName: 'signDate',
                placeholder: '请选择结束时间',
              },
            },
          ],
        },
        {
          title: '实际合作比例',
          formItems: [
            {
              label: '实际合作比例(0-1)',
              prop: 'actualCooperationRatio',
              inputType: 'inputNumber',
              min: 0,
              max: 1,
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        // contractNo: {
        //   required: true,
        //   message: '请选择合作框架',
        //   trigger: 'change',
        // },
        ratio: {
          required: true,
          // message: '请输入数字',
          trigger: 'change',
          // validator: this.checkNum,
        },
        estimate: {
          required: true,
          // message: '请输入数字',
          trigger: 'change',
          // validator: this.checkNum,
        },
        actualCooperationRatio: {
          required: true,
          message: '请输入实际合作比例(0-1)',
          trigger: 'change',
        },
      },
      cooperationData: {},
      cooperationShow: false,
      cooperationTable: {},

      provinceKey: '',
      cityKey: '',
      oneMajorKey: '',
      isProChange: false, // 选择后
      isMajorChange: false, // 选择后
      // peopleShow: false,
      // peopleData: {},
      // selectTable: {},
    };
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        if (val) {
          console.log('val', val);
          this.inputDisabled = val.configType === 'detail';
          this.isEdit = ['add', 'edit'].includes(val.configType);
          this.isAdd = ['add'].includes(val.configType);
          if (!this.isAdd) {
            this.reqDetail();
          }
          this.isProChange = false;
          this.isMajorChange = false;
        }
      },
    },
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        this.form = {
          ...this.form,
          ...row,
        };
      }
    },
    submitFormItem(formName = 'supplyFormItem') {
      this.$nextTick(() => {
        console.log(this.$refs.supplyFormItem.$refs.formData);

        // return;
        this.$refs.supplyFormItem.$refs.formData.validate((valid) => {
          if (valid) {
            // this.$message({
            //   showClose: true,
            //   message: '表单校验通过',
            // });
            this.$refs.supplyFormItem.submitForm();
          } else {
            console.log('error submit!!');
            this.$message({
              showClose: true,
              message: '表单校验不通过',
              type: 'warning',
            });

            return false;
          }
        });
      });
    },
    async submitForm(val) {
      // console.log('this.data', this.data);
      const { configType, row } = this.data;

      // console.log('this.val', val);
      if (!this.isProChange) {
        await this.setCity(val.areaPro, true, val.areaCity);
      }
      if (!this.isMajorChange) {
        await this.setMajor(val.oneMajor);
      }

      const param = {
        ...val,
        id: val.id,
        unitName: val.unitName,
        unitId: val.unitId,
        contractNo: val.contractNo,
        areaPro: this.provinceKey ? this.provinceKey : val.areaPro,
        areaCity: this.cityKey ? this.cityKey : val.areaCity,
        oneMajor: this.oneMajorKey ? this.oneMajorKey : val.oneMajor,
        ratio: val.ratio,
        estimate: val.estimate,
        sTime: val.sTime,
        eTime: val.eTime,
        frameworkId: val.frameworkId,
      };
      const message = '处理成功';

      console.log(param);

      // return;

      if (configType === 'edit') {
        updateV1CooperationDetails(param).then((res) => {
          if (res && res.code === '200') {
            this.$notify({
              title: '成功',
              message,
              type: 'success',
              position: 'bottom-right',
            });
            this.$emit('success');
          } else {
            this.$emit('success');
          }
        });
      } else if (configType === 'add') {
        Reflect.deleteProperty(param, 'id');
        saveCooperationDetails(param).then((res) => {
          if (res && res.code === '200') {
            this.$notify({
              title: '成功',
              message,
              type: 'success',
              position: 'bottom-right',
            });
            this.$emit('success');
          } else {
            this.$emit('success');
          }
        });
      }
    },
    // closeEdit() {
    //   this.peopleShow = false;
    //   this.peopleData = {};
    // },
    successEdit(selectTable) {
      // console.log('selectTable', selectTable);
      this.selectTable = selectTable;
      // this.form.nextAuditPeople = selectTable.realName;
      this.closeEdit();
    },
    cancelForm() {
      this.form = {};
      this.cooperateForm = {};
      this.$refs.supplyFormItem.cancelForm();
    },
    closeCooperation() {
      this.cooperationShow = false;
      this.cooperationData = {};
    },
    successCooperation(selectTable) {
      this.cooperationTable = selectTable;
      console.log(this.cooperationTable);
      this.form = {
        ...this.form,
        contractNo: selectTable.contractName,
        frameworkId: selectTable.id,
        unitName: selectTable.unitName,
        unitId: selectTable.unitId,
      };
      // this.form.contractNo = selectTable.contractName;
      // this.form.frameworkId = selectTable.id;
      // this.form.unitName = selectTable.unitName;
      // this.form.unitId = selectTable.unitId;
      this.setCity(selectTable.province, true, selectTable.city);
      this.setMajor(selectTable.major);
      this.isProChange = true;
      this.isMajorChange = true;
      // this.form.areaPro = selectTable.province;
      // this.form.areaCity = selectTable.city;
      this.form = { ...this.form };
      this.closeCooperation();
    },

    // 获取省份key
    setProvinceKey(val) {
      const options = this.common().provincialCode;
      const findItem = options.filter((option) => option.name === val);

      console.log(findItem);
    },

    // 设置城市选项
    // isProvinceName: 是否中文省份名称 boolean
    // cityName: 中文城市名称 string
    async setCity(province, isProvinceName, cityName) {
      const options = this.common().provincialCode;

      // console.log(province);

      let findItem,
        cityItem = [];

      if (isProvinceName) {
        findItem = options.filter((option) => option.name === province);
      } else {
        findItem = options.filter((option) => option.id === province);
      }

      console.log(findItem);

      const city = await this.$getCode(findItem[0].id);

      if (cityName) {
        cityItem = city.filter((option) => option.name === cityName);
        this.cityKey = cityItem[0].id;
      } else {
        this.cityKey = '';
      }

      this.form = {
        ...this.form,
        areaPro: findItem[0].id,
        areaCity: cityName ? cityItem[0].id : undefined,
      };

      this.provinceKey = findItem[0].id;
      // this.cityKey = cityItem[0].id;

      // console.log(this.provinceKey, this.cityKey);

      // console.log('city', city);
      this.$set(this.layout[0].formItems[3], 'options', city);
    },

    // 设置专业
    setMajor(major) {
      const options = this.common().majorCode;
      const findItem = options.filter((option) => option.name === major);

      // console.log(options, findItem);

      // return;
      this.form = {
        ...this.form,
        oneMajor: findItem[0].id,
      };
      this.oneMajorKey = findItem[0].id;
    },

    checkNum(rule, value, callback) {
      if (!value) {
        return callback(); // 无值也通过，非必填
        // return callback(new Error('请输入内容')); // 必填
      }
      const enterValue = parseFloat(value);

      // console.log(enterValue);
      // eslint-disable-next-line require-unicode-regexp
      const reg = /^(0.\d+|0|1)$/;

      // console.log(reg.test(enterValue));
      // debugger;

      // eslint-disable-next-line no-negated-condition
      if (!reg.test(enterValue)) {
        callback(new Error('请输入0~1数字值'));
      } else {
        callback();
      }
    },
  },
};
</script>

<style lang="less" scoped>
#base {
}
</style>
