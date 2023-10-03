<template>
  <div class="projectBaseInfo">
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

export default {
  name: 'projectBaseInfo',
  inject: ['common'],
  components: {
    FormItem,
  },
  props: {
    show: Boolean,
    data: {},
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    info: {
      deep: true,
      handler(val) {
        this.form = {
          ...val,
        };
        this.getTwoMajor(val);
      },
    },
  },
  data() {
    const { configType } = this.data;

    return {
      /** 输入禁用 */
      inputDisabled: true,
      isEdit: false,
      isAdd: false,
      form: {},
      layout: [
        {
          title: '项目基础信息',
          formItems: [
            {
              label: 'ERP编号',
              prop: 'erpNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目名称',
              prop: 'projectName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '生产中心',
              prop: 'deptId',
              inputType: 'select',
              span: 12,
              options: this.common().productionCenterCode,
            },
            {
              label: '设计单位',
              prop: 'design',
              inputType: 'select',
              span: 12,
              options: this.common().designUnitCode,
            },
            {
              label: '监理单位',
              prop: 'supervision',
              inputType: 'select',
              span: 12,
              options: this.common().supervisionUnitCode,
            },
            {
              label: '建设单位',
              prop: 'constructions',
              inputType: 'select',
              span: 12,
              options: this.common().constructionCode,
            },
            {
              label: '项目状态',
              prop: 'projectStatus',
              inputType: 'select',
              span: 12,
              options: this.common().projectStatusCode,
            },
            {
              label: '预估收入',
              prop: 'estimatedRevenue',
              inputType: 'input',
              span: 12,
            },
            {
              label: '预估成本',
              prop: 'estimatedCost',
              inputType: 'input',
              span: 12,
            },
            {
              label: '一级专业',
              prop: 'oneMajor',
              inputType: 'select',
              span: 12,
              options: this.common().majorCode,
              // onChange: (val) => {
              //   this.setTwoMajor(val);
              // },
            },
            {
              label: '二级专业',
              prop: 'twoMajor',
              inputType: 'select',
              span: 12,
              options: [],
              // onChange: (val) => {
              //   this.form = {
              //     ...this.form,
              //     twoMajor: val,
              //   };
              // },
            },
            {
              label: '开工时间',
              prop: 'startTime',
              inputType: 'date',
              span: 12,
            },
            {
              label: '完工时间',
              prop: 'endTime',
              inputType: 'date',
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
    console.log(this.common().supervisionUnitCode);
    // this.$nextTick(() => {
    // });
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
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
    getTwoMajor(val) {
      if (!val.oneMajor) {
        return;
      }
      this.$getCode(val.oneMajor).then((data) => {
        this.$set(this.layout[0].formItems[10], 'options', data);
      });
    },
  },
};
</script>

<style scoped></style>
