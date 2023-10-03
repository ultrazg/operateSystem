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
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import { updateCooperationDetails } from '@/api/cooperationUnitManagement/index';
export default {
  name: 'baseInfo',
  components: {
    FormItem,
  },
  props: {
    show: Boolean,
    data: {},
  },
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
          title: '合作信息数据',
          disabled: true,
          formItems: [
            {
              label: '合作单位',
              prop: 'unitName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作框架',
              prop: 'contractNo',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作合同总额(万元)',
              prop: 'cooConAllAmount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '省份',
              prop: 'areaPro',
              inputType: 'input',
              span: 12,
            },
            {
              label: '一级专业',
              prop: 'oneMajor',
              inputType: 'input',
              span: 12,
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
              inputType: 'input',
              span: 12,
            },
            {
              label: '结束时间',
              prop: 'eTime',
              inputType: 'input',
              span: 12,
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
        // no: { required: true, message: "请输入公告名称", trigger: "blur" },
        // address: { required: true, message: "请输入公告号", trigger: "blur" },
        // buildArea: {
        //   required: true,
        //   message: "请选择公告类型",
        //   trigger: "blur",
        // },
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
        this.form = {
          ...this.form,
          ...row,
        };
        console.log(this.form);
      }
    },
    submitFormItem() {
      // this.$refs.supplyFormItem.submitForm();
      console.log('submit work');
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const param = {
        ...val,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      updateCooperationDetails(param).then((res) => {
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
